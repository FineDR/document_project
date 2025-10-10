/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import axios from "axios";
import { achievementsSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

// Extracted type from your Zod schema
export type AchievementFormData = z.infer<typeof achievementsSchema>;

// Payload type expected by backend
export type AchievementPayload = {
  full_name: string;
  email: string;
  achievements: { value: string }[];
};

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// Get authorization headers from Redux store
const getAuthHeaders = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  if (!token) throw new Error("No auth token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Create new achievements
export const submitAchievements = async (data: AchievementPayload) => {
  const response = await axios.post(`${API_BASE_URL}/api/achievements/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update achievements by ID
export const updateAchievement = async (id: number, data: AchievementPayload) => {
  const response = await axios.put(`${API_BASE_URL}/api/achievements/${id}/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Delete achievement by ID
export const deleteAchievement = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/achievements/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Fetch all achievements
export const fetchAchievements = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/achievements/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
