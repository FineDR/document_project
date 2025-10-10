import { PAYMENTS_ENDPOINTS } from "../endpoints";
import axiosClient from "../axiosClient";

export const payments=()=>axiosClient(PAYMENTS_ENDPOINTS.initiate, {method: "POST"});
export const checkout=(data:any)=>axiosClient(PAYMENTS_ENDPOINTS.checkout, {method: "POST", data});
export const azampayCallback=(data:any)=>axiosClient(PAYMENTS_ENDPOINTS.azampayCallback, {method: "POST", data});
export const webhook=(data:any)=>axiosClient(PAYMENTS_ENDPOINTS.webhook, {method: "POST", data});
