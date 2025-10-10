import axios from "axios";
import { z } from "zod";
import { educationSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type EducationDetails = z.infer<typeof educationSchema>;

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const getAuthHeaders = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  if (!token) throw new Error("No auth token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Create
export const submitEducation = async (data: { education: EducationDetails[] }) => {
  const response = await axios.post(`${API_BASE_URL}/api/education/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update
export const updateEducation = async (id: number, payload: EducationDetails) => {
  const response = await axios.put(`${API_BASE_URL}/api/education/${id}/`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Delete
export const deleteEducation = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/education/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
