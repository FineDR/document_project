// src/hooks/useCurrentUserCV.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchCv } from "../features/cv/cvSlice";
import type { User } from "../types/cv/cv";

export type CVError = string | { detail: string } | null;

export const useCurrentUserCV = () => {
  const dispatch = useAppDispatch();
  const cv = useAppSelector((state) => state.cv.cv);
  const loading = useAppSelector((state) => state.cv.loading);
  const error = useAppSelector((state) => state.cv.error) as CVError;

  useEffect(() => {
    dispatch(fetchCv());
  }, [dispatch]);

  const refresh = () => dispatch(fetchCv());

  return { data: cv as User | null, loading, error, refresh };
};
