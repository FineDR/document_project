import { z } from "zod";
import axios from "axios";
import { referencesSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type ReferencesData = z.infer<typeof referencesSchema>;

const API_BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL;

// ✅ Helper to get auth headers
const getAuthHeaders = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  if (!token) throw new Error("No auth token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Create new references
export const submitReferences = async (data: ReferencesData) => {
  const response = await axios.post(`${API_BASE_URL}/api/references/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Update existing reference
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateReference = async (id: number, payload: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/references/${id}/`,
    payload,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ✅ Fetch references (for displaying in CV or UI)
export const fetchReferences = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/references/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Delete a single reference
export const deleteReference = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/references/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
