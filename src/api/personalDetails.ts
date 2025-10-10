import { z } from "zod";
import axios from "axios";
import { personalInformationSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type PersonalDetails = z.infer<typeof personalInformationSchema>;

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

// ✅ Submit or create personal details
export const submitPersonalDetails = async (data: PersonalDetails) => {
  const response = await axios.post(`${API_BASE_URL}/api/personal-details/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Update personal details (no ID needed)
export const updatePersonalDetails = async (payload: Partial<PersonalDetails>) => {
  const response = await axios.put(`${API_BASE_URL}/api/personal-details/`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Delete personal details (no ID needed)
export const deletePersonalDetails = async () => {
  const response = await axios.delete(`${API_BASE_URL}/api/personal-details/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Fetch personal details
export const fetchPersonalDetails = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/personal-details/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
