/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { RootState } from "../store/store";
import { store } from "../store/store";
import type { WorkExperience } from "../types/cv/cv";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// ✅ Get auth headers
const getAuthHeaders = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  if (!token) throw new Error("No auth token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Submit work experience
export const submitWorkExperience = async (data: WorkExperience) => {
  const response = await axios.post(`${API_BASE_URL}/api/work-experiences/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Update work experience
export const updateWorkExperience = async (id: number, payload: WorkExperience) => {
  const response = await axios.put(`${API_BASE_URL}/api/work-experiences/${id}/`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Delete work experience
export const deleteWorkExperience = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/work-experiences/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Fetch work experiences
export const fetchWorkExperiences = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/work-experiences/`, {
    headers: getAuthHeaders(),
  });
  return response.data as WorkExperience[];
};
