// src/api/axiosClient.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  // Do NOT set 'Content-Type' here globally
});

// Helper to remove extra quotes
const sanitizeToken = (token: string | null) => {
  if (!token) return null;
  return token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token;
};

// Attach token
axiosClient.interceptors.request.use((config) => {
  const token = sanitizeToken(localStorage.getItem("token"));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = sanitizeToken(localStorage.getItem("refreshToken"));

      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          localStorage.setItem("token", newAccessToken);

          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
