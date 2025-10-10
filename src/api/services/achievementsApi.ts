import axiosClient from "../axiosClient";
import { ACHIEVEMENTS_ENDPOINTS } from "../endpoints";

export const getAchievements = () =>axiosClient.get(ACHIEVEMENTS_ENDPOINTS.list);

export const getAchievement = (id: number) =>axiosClient.get(ACHIEVEMENTS_ENDPOINTS.detail(id));

export const createAchievement = (data: any) =>axiosClient.post(ACHIEVEMENTS_ENDPOINTS.list, data);

export const updateAchievement = (id: number, data: any) =>axiosClient.put(ACHIEVEMENTS_ENDPOINTS.detail(id), data);

export const deleteAchievement = (id: number) =>axiosClient.delete(ACHIEVEMENTS_ENDPOINTS.detail(id));