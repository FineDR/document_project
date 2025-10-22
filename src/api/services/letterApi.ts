import axiosClient from "../axiosClient";

import { LETTERS_ENDPOINTS } from "../endpoints";

export const getLetters = () => axiosClient.get(LETTERS_ENDPOINTS.list);

export const getLetter = (id: number) => axiosClient.get(LETTERS_ENDPOINTS.detail(id));
export const createLetter = (data: any) => axiosClient.post(LETTERS_ENDPOINTS.list, data);

export const updateLetter = (id: number, data: any) => axiosClient.put(LETTERS_ENDPOINTS.detail(id), data);

export const deleteLetter = (id: number) => axiosClient.delete(LETTERS_ENDPOINTS.detail(id));


export const generateLetter = (data: any) => axiosClient.post(LETTERS_ENDPOINTS.generate, data);