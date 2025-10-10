import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const publicClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})
export default publicClient;