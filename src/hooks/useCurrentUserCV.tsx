// src/hooks/useCurrentUserCV.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchCurrentUserCV } from "../store/cvSlice";
import type { User } from "../types/cv/cv";

export type CVError = string | { detail: string } | null;

export const useCurrentUserCV = () => {
  const dispatch = useAppDispatch();
  const selectedCV = useAppSelector((state) => state.cv.selectedCV);
  const loading = useAppSelector((state) => state.cv.loading);
  const error = useAppSelector((state) => state.cv.error) as CVError;

  useEffect(() => {
    // Fetch only if not already loaded
    if (!selectedCV) {
      dispatch(fetchCurrentUserCV());
    }
  }, [dispatch, selectedCV]);

  // Optional: manual refresh if needed
  const refresh = () => {
    dispatch(fetchCurrentUserCV());
  };

  return { data: selectedCV as User | null, loading, error, refresh };
};
