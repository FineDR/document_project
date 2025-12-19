// services/risala.ts
import axiosClient from "../axiosClient";
import { RISALA_ENDPOINTS } from "../endpoints";

// Create a new Risala
export const createRisala = (data: any) =>
  axiosClient.post(RISALA_ENDPOINTS.create, data);

// Update the current user's Risala
export const updateRisala = (data: any) =>
  axiosClient.put(RISALA_ENDPOINTS.detail, data);

// Get the current user's Risala
export const getRisala = () =>
  axiosClient.get(RISALA_ENDPOINTS.detail);

// AI-generated values for a form step
export const generateAIValues = (payload: {
  step: number;
  instruction: string;
  eventType?: string;
}) => axiosClient.post(RISALA_ENDPOINTS.aiGenerate, payload);
