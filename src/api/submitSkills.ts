import type { z } from "zod";
import axios from "axios";
import { skillsSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type SkillsData = z.infer<typeof skillsSchema>;

export interface SkillsPayload {
  technicalSkills: { id?: number; value: string }[];
  softSkills: { id?: number; value: string }[];
  email: string;
  full_name: string;
}

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const getAuthHeader = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  if (!token) throw new Error("No auth token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Create new skills
export const submitSkills = async (payload: SkillsPayload) => {
  const response = await axios.post(`${API_BASE_URL}/api/skills/`, payload, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// ✅ Update a single skill
export const updateSkill = async (id: number, payload: SkillsPayload) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/skills/${id}/`,
    payload,
    { headers: getAuthHeader() }
  );
  return response.data;
};


// ✅ Delete a single skill
export const deleteSkill = async (skillId: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/skills/${skillId}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
