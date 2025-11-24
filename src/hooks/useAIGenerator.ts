/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../store/store";
import { generateCV } from "../features/auth/authSlice";
import { buildAIPromptDynamic } from "../utils/aiPromptBuilderDynamic";
import { useState } from "react";

export function useAIGenerator() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const generate = async ({
    section,
    getValues,
  }: {
    section: string;
    getValues: () => any;
  }) => {
    setLoading(true);

    try {
      const prompt = buildAIPromptDynamic(section as any, {
        [section]: getValues(),
      });

      const resultAction = await dispatch(
        generateCV({
          section,
          userData: { prompt },
        })
      );

      if (generateCV.fulfilled.match(resultAction)) {
        return resultAction.payload; // AI TEXT
      }

      return null;
    } catch (err) {
      console.error("AI generation failed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
