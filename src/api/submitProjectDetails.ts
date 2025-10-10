/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import axios from "axios";
import { projectSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type ProjectDetails = z.infer<typeof projectSchema>;

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

// ✅ Create new projects
export const submitProjectDetails = async (data: ProjectDetails) => {
  const response = await axios.post(`${API_BASE_URL}/api/projects/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Update existing project
export const updateProject = async (id: string, payload: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/projects/${id}/`,
    payload,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ✅ Delete a project
export const deleteProject = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/api/projects/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Fetch projects (for displaying in CV or UI)
export const fetchProjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/projects/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};