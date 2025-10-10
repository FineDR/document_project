import axiosClient from "../axiosClient";

import { CERTIFICATES_ENDPOINTS } from "../endpoints";

export const getCertificates = () =>axiosClient.get(CERTIFICATES_ENDPOINTS.list);

export const getCertificate = (id: number) =>axiosClient.get(CERTIFICATES_ENDPOINTS.detail(id));

export const createCertificate = (data: any) =>axiosClient.post(CERTIFICATES_ENDPOINTS.list, data);

export const updateCertificate = (id: number, data: any) =>axiosClient.put(CERTIFICATES_ENDPOINTS.detail(id), data);

export const deleteCertificate = (id: number) =>axiosClient.delete(CERTIFICATES_ENDPOINTS.detail(id));