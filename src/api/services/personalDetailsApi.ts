import axiosClient from "../axiosClient";
import { PERSONAL_DETAILS_ENDPOINTS } from "../endpoints";

// Get all personal details (for admin or multiple users, if needed)
export const getPersonalDetails = () =>
  axiosClient.get(PERSONAL_DETAILS_ENDPOINTS.list);

// Get current user's personal details
export const getPersonalDetail = () =>
  axiosClient.get(PERSONAL_DETAILS_ENDPOINTS.list); // same endpoint as backend uses request.user

// Create or update personal details (no ID needed)
export const createPersonalDetail = (data: any) =>
  axiosClient.post(PERSONAL_DETAILS_ENDPOINTS.list, data);

// Update personal details (no ID needed)
export const updatePersonalDetail = (data: any) =>
  axiosClient.put(PERSONAL_DETAILS_ENDPOINTS.list, data);

// Delete personal details (no ID needed)
export const deletePersonalDetail = () =>
  axiosClient.delete(PERSONAL_DETAILS_ENDPOINTS.list);
