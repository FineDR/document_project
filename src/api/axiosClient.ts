import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- Helper functions ---
const sanitizeToken = (token: string | null) => {
  if (!token) return null;
  return token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token;
};

const getAccessToken = () => sanitizeToken(localStorage.getItem("token"));
const getRefreshToken = () => sanitizeToken(localStorage.getItem("refreshToken"));

const setAccessToken = (token: string) => localStorage.setItem("token", token);

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// --- Token refresh logic ---
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// --- Request interceptor ---
axiosClient.interceptors.request.use((config) => {
  
  const token = getAccessToken();
  //  console.log("Request token:", token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor ---
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple refresh calls
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        setAccessToken(newAccessToken);

        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        clearAuth();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
