import axiosClient from "../axiosClient";

import {WORK_EXPERIENCES_ENDPOINTS} from "../endpoints";

export const getWorkExperiences = () => axiosClient.get(WORK_EXPERIENCES_ENDPOINTS.list);

export const getWorkExperience = (id: number) => axiosClient.get(WORK_EXPERIENCES_ENDPOINTS.detail(id));

export const createWorkExperience = (data: any) => axiosClient.post(WORK_EXPERIENCES_ENDPOINTS.list, data);

export const updateWorkExperience = (id: number, data: any) => axiosClient.put(WORK_EXPERIENCES_ENDPOINTS.detail(id), data);

export const deleteWorkExperience = (id: number) => axiosClient.delete(WORK_EXPERIENCES_ENDPOINTS.detail(id));  