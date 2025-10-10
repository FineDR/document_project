import publicClient from "../publicClient";
import { JOBS_ENDPOINTS } from "../endpoints";

export const getJobs = () => publicClient.get(JOBS_ENDPOINTS.list);

export const getJob = (id: number) => publicClient.get(JOBS_ENDPOINTS.detail(id));
export const addJob = (data: any) => publicClient.post(JOBS_ENDPOINTS.list, data);
export const updateJob = (id: number, data: any) => publicClient.put(JOBS_ENDPOINTS.detail(id), data);
export const deleteJob = (id: number) => publicClient.delete(JOBS_ENDPOINTS.detail(id));