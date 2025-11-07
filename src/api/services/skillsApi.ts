import axiosClient from "../axiosClient";

import {SKILLS_ENDPOINTS} from "../endpoints";

export const getSkills=()=>axiosClient.get(SKILLS_ENDPOINTS.list);

export const getSkill=(id:number)=>axiosClient.get(SKILLS_ENDPOINTS.detail(id));

export const createSkill=(data:any)=>axiosClient.post(SKILLS_ENDPOINTS.list,data);

export const updateSkill=(id:number,data:any)=>axiosClient.put(SKILLS_ENDPOINTS.detail(id),data);

export const deleteSkill=(id:number)=>axiosClient.delete(SKILLS_ENDPOINTS.detail(id));
export const createSkillSetApi = (data: { 
  technicalSkills: { value: string }[]; 
  softSkills: { value: string }[] 
}) => {
  return axiosClient.post(SKILLS_ENDPOINTS.list, data);
};

export const updateSkillSetApi = (
  id: number,
  data: { 
    technicalSkills: { value: string }[]; 
    softSkills: { value: string }[] 
  }
) => {
  return axiosClient.put(SKILLS_ENDPOINTS.detail(id), data);
};