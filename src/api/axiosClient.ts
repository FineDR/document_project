import axios from "axios";


const BASE_URL=import.meta.env.VITE_APP_API_BASE_URL;

const axiosClient=axios.create({
    baseURL:BASE_URL,
    headers:{
        'Content-Type':'application/json',
    }
})

axiosClient.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
   if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

axiosClient.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest=error.config;
        if(error.response.status===401 && !originalRequest._retry ){
            originalRequest._retry=true;
        const refreshToken=localStorage.getItem('refreshToken');
        if(refreshToken){
            try{
                const res=await axios.post(`${BASE_URL}/auth/token/refresh/`,{
                    refresh:refreshToken
                });
                const newAccessToken=res.data.access;
                localStorage.setItem('token',newAccessToken);
                axiosClient.defaults.headers.common['Authorization']=`Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization']=`Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            }catch(err){
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href='/login';
            }
        }else{
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href='/login';
        }
    }
    if(error.response){
        const status=error.response.status;
        const data=error.response.data;
        switch(status){
            case 400:
                console.error("Bad Request:",data);
                break;
            case 403:
                console.error("Forbidden:",data);
                break;
            case 404:
                console.error("Not Found:",data);
                break;
            case 500:
                console.error("Server Error:",data);
                break;
            default:
                console.error("Error:",data);
                break;
        }
    }else if(error.request){
        console.error("No response received:",error.request);
    }else{
        console.error("Error setting up request:",error.message);
    }
    return Promise.reject(error);
    }
)
export default axiosClient;