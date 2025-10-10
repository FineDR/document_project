import axios from "axios";
import { type ProjectData } from "../store/report/reportSlice";
const API_BASE_URL=import.meta.env.VITE_APP_API_BASE_URL;
export const generatePDF = async (data: ProjectData, logoFile: File | null) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (logoFile) formData.append("logo", logoFile);

  const response = await axios.post(
    `${API_BASE_URL}/api/report/generate-pdf/`,
    formData,
    {
      responseType: "blob",
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
