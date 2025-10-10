import axiosClient from "../axiosClient";

import {CAREER_OBJECTIVE_ENDPOINTS} from "../endpoints";

export const getCareerObjectives=()=>axiosClient.get(CAREER_OBJECTIVE_ENDPOINTS.list);

export const getCareerObjective=(id:number)=>axiosClient.get(CAREER_OBJECTIVE_ENDPOINTS.detail(id));

export const createCareerObjective=(data:any)=>axiosClient.post(CAREER_OBJECTIVE_ENDPOINTS.list,data);

export const updateCareerObjective=(id:number,data:any)=>axiosClient.put(CAREER_OBJECTIVE_ENDPOINTS.detail(id),data);

export const deleteCareerObjective=(id:number)=>axiosClient.delete(CAREER_OBJECTIVE_ENDPOINTS.detail(id));