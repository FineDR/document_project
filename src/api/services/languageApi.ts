import axiosClient from "../axiosClient";

import { LANGUAGES_ENDPOINTS } from "../endpoints";

export const getLanguages = () => axiosClient.get(LANGUAGES_ENDPOINTS.list);

export const getLanguage = (id: number) => axiosClient.get(LANGUAGES_ENDPOINTS.detail(id));
export const createLanguage = (data: any) => axiosClient.post(LANGUAGES_ENDPOINTS.list, data);

export const updateLanguage = (id: number, data: any) => axiosClient.put(LANGUAGES_ENDPOINTS.detail(id), data);

export const deleteLanguage = (id: number) => axiosClient.delete(LANGUAGES_ENDPOINTS.detail(id));