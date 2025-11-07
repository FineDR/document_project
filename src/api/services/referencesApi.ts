import axiosClient from "../axiosClient";
import { REFERENCES_ENDPOINTS } from "../endpoints";

export const getReferences=()=>axiosClient.get(REFERENCES_ENDPOINTS.list);

export const getReference=(id:number)=>axiosClient.get(REFERENCES_ENDPOINTS.detail(id));

export const createReference=(data:{references:any[]})=>axiosClient.post(REFERENCES_ENDPOINTS.list,data);

export const updateReference=(id:number,data:any)=>axiosClient.put(REFERENCES_ENDPOINTS.detail(id),data);

export const deleteReference=(id:number)=>axiosClient.delete(REFERENCES_ENDPOINTS.detail(id));