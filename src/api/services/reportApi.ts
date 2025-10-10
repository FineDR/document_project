import axiosClient from "../axiosClient";

import { REPORT_ENDPOINTS } from "../endpoints";

export const getReport = () => axiosClient.get(REPORT_ENDPOINTS.generatePDF);
