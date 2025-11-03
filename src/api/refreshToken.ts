// src/api/auth/refreshToken.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    const newAccessToken = res.data.access;
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return null;
  }
};
