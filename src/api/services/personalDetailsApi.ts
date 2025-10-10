import axiosClient from "../axiosClient";

import {PERSONAL_DETAILS_ENDPOINTS} from "../endpoints";

export const getPersonalDetails=()=>axiosClient.get(PERSONAL_DETAILS_ENDPOINTS.list);

export const getPersonalDetail=(id:number)=>axiosClient.get(PERSONAL_DETAILS_ENDPOINTS.detail(id));

export const createPersonalDetail=(data:any)=>axiosClient.post(PERSONAL_DETAILS_ENDPOINTS.list,data);

export const updatePersonalDetail=(id:number,data:any)=>axiosClient.put(PERSONAL_DETAILS_ENDPOINTS.detail(id),data);

export const deletePersonalDetail=(id:number)=>axiosClient.delete(PERSONAL_DETAILS_ENDPOINTS.detail(id));