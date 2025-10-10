// src/api/languages.ts
import axios from "axios";
import { z } from "zod";
import { store } from "../store/store";
import type { RootState } from "../store/store";
import { languagesSchema } from "../components/forms/cvValidationSchema";

export type LanguagesData = z.infer<typeof languagesSchema>;

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

export const submitLanguages = async (data: LanguagesData) => {
  const response = await axios.post(`${API_BASE_URL}/api/languages/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateLanguage = async (id: number, data: { language: string; proficiency: string }) => {
  const response = await axios.put(`${API_BASE_URL}/api/languages/${id}/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteLanguage = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/languages/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
