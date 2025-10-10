import axiosClient from "../axiosClient";
import { EDUCATION_ENDPOINTS } from "../endpoints";

export const getEducations = () => axiosClient.get(EDUCATION_ENDPOINTS.list);

export const getEducation = (id: number) => axiosClient.get(EDUCATION_ENDPOINTS.detail(id));

export const createEducation = (data: any) => axiosClient.post(EDUCATION_ENDPOINTS.list, data);

export const updateEducation = (id: number, data: any) => axiosClient.put(EDUCATION_ENDPOINTS.detail(id), data);

export const deleteEducation = (id: number) => axiosClient.delete(EDUCATION_ENDPOINTS.detail(id));