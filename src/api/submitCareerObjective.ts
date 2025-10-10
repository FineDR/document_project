// src/api/submitCareerObjective.ts
import { z } from "zod";
import axios from "axios";
import { careerObjectiveSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type CareerObjectiveData = z.infer<typeof careerObjectiveSchema>;

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// Get auth token from Redux
const getAuthHeader = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  return { Authorization: `Bearer ${token}` };
};

// CREATE a new career objective
export const submitCareerObjective = async (data: CareerObjectiveData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/career-objective/`,
    data,
    { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
  );
  return response.data;
};

// READ all career objectives for current user
export const fetchCareerObjectives = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/career-objective/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// UPDATE a career objective by ID
export const updateCareerObjective = async (id: number, data: CareerObjectiveData) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/career-objective/${id}/`,
    data,
    { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
  );
  return response.data;
};

// DELETE a career objective by ID
export const deleteCareerObjective = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/career-objective/${id}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
