/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import axios from "axios";
import { certificationsSchema } from "../components/forms/cvValidationSchema";
import type { RootState } from "../store/store";
import { store } from "../store/store";

export type CertificateDetails = z.infer<typeof certificationsSchema>;

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const getAuthHeader = () => {
  const state: RootState = store.getState();
  const token = state.auth.access;
  return { Authorization: `Bearer ${token}` };
};

export const submitCertificates = async (data: CertificateDetails) => {
  const response = await axios.post(`${API_BASE_URL}/api/certificates/`, data, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return response.data;
};

export const updateCertificate = async (id: number, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/api/certificates/${id}/`, data, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return response.data;
};

export const deleteCertificate = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/api/certificates/${id}/`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
