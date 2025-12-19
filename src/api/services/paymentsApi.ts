import { PAYMENTS_ENDPOINTS } from "../endpoints";
import axiosClient from "../axiosClient";

export const initiatePayment = (data: any) =>
  axiosClient.post(PAYMENTS_ENDPOINTS.initiate, data);

export const checkout = (data: any) =>
  axiosClient.post(PAYMENTS_ENDPOINTS.checkout, data);

export const azampayCallback = (data: any) =>
  axiosClient.post(PAYMENTS_ENDPOINTS.azampayCallback, data);

export const webhook = (data: any) =>
  axiosClient.post(PAYMENTS_ENDPOINTS.webhook, data);
