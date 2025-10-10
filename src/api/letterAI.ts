/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { z } from "zod";
import type { RootState } from "../store/store";
import { store } from "../store/store";

// Raw letter input schema
export const letterSchema = z.object({
  recipient: z.string().min(1, "Recipient name is required"),
  recipientTitle: z.string().min(1, "Recipient title is required"),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  purpose: z.string().min(1, "Letter purpose is required"),
  senderName: z.string().min(1, "Your full name is required"),
  senderPhone: z.string().min(1, "Phone number is required"),
});

// Type inferred from schema
export type LetterFields = z.infer<typeof letterSchema>;

// AI-processed letter response
export type LetterResponse = {
  subject: string;
  recipientAddress: string;
  content: string;   // Cleaned, professional letter body
  closing: string;   // e.g., "Sincerely,"
};

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// Get auth headers from Redux store
const getAuthHeaders = (): Record<string, string> => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  if (!token) throw new Error("No auth token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Send raw letter details to backend AI, receive cleaned professional letter
 */
export const generateCleanLetter = async (
  data: LetterFields
): Promise<LetterResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/generate-letter/`, data, {
      headers: getAuthHeaders(),
    });
    // Response should already contain AI-cleaned letter
    // subject, recipientAddress, content, closing
    console.log("AI cleaned letter response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || error.message || "Failed to generate letter";
      console.error("Error generating cleaned letter:", msg);
      throw new Error(msg);
    }
    console.error("Unexpected error generating letter:", error);
    throw new Error("An unexpected error occurred");
  }
};

// Additional letter-related API functions that might be useful

// Save a generated letter
export const saveLetter = async (data: LetterFields & LetterResponse) => {
  const response = await axios.post(`${API_BASE_URL}/api/letters/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update a saved letter by ID
export const updateLetter = async (id: number, data: LetterFields & LetterResponse) => {
  const response = await axios.put(`${API_BASE_URL}/api/letters/${id}/`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Delete a saved letter by ID
export const deleteLetter = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/letters/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Fetch all saved letters for the current user
export const fetchLetters = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/letters/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Fetch a specific letter by ID
export const fetchLetterById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/api/letters/${id}/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};