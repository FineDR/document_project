import axiosClient from '../axiosClient';
import {PROJECTS_ENDPOINTS} from '../endpoints';

export const getProjects=()=>axiosClient.get(PROJECTS_ENDPOINTS.list);

export const getProject=(id:number)=>axiosClient.get(PROJECTS_ENDPOINTS.detail(id));

export const createProject=(data:any)=>axiosClient.post(PROJECTS_ENDPOINTS.list,data);

export const updateProject=(id:number,data:any)=>axiosClient.put(PROJECTS_ENDPOINTS.detail(id),data);

export const deleteProject=(id:number)=>axiosClient.delete(PROJECTS_ENDPOINTS.detail(id));