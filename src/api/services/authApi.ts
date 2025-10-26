import axiosClient from "../axiosClient";

import { AUTH_ENDPOINTS } from "../endpoints";

export const login = (data: any) => axiosClient.post(AUTH_ENDPOINTS.login, data);

export const register = (data: any) => axiosClient.post(AUTH_ENDPOINTS.register, data);

export const logout = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return Promise.resolve(); // skip logout if token missing

  return axiosClient.post(AUTH_ENDPOINTS.logout, { refresh: refreshToken });
};

export const getProfile = () => axiosClient.get(AUTH_ENDPOINTS.profile);

export const updateProfile = (data: any) => axiosClient.put(AUTH_ENDPOINTS.profile, data);


export const resetPassword = (data: any) => axiosClient.post(AUTH_ENDPOINTS.resetPassword, data);


export const verifyEmail = (data: any) => axiosClient.post(AUTH_ENDPOINTS.verifyEmail, data);

export const users=()=>axiosClient.get(AUTH_ENDPOINTS.users);
export const userDetails=()=>axiosClient.get(AUTH_ENDPOINTS.admin);
export const signUpOrSignInWithGoogle = (data: any) =>
  axiosClient.post(AUTH_ENDPOINTS.googleAuth, data,{ withCredentials: true });



