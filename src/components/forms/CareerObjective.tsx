/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerObjectiveSchema } from "./cvValidationSchema";
import type { CareerObjective } from "../../types/cv/cv";
import {
  submitCareerObjective,
  updateCareerObjective,
} from "../../api/submitCareerObjective";
import Button from "../formElements/Button";
import { z } from "zod";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";

type FormFields = z.infer<typeof careerObjectiveSchema>;

interface Props {
  editingObjective?: CareerObjective;
  editingIndex?: number;
  onDone: (updated: CareerObjective) => void;
}

const CareerObjectiveFormDetails = ({
  editingObjective,
  editingIndex,
  onDone,
}: Props) => {
  // Minimum loader duration: 1.5s
  const { loading, withLoader } = useTimedLoader(1500);

  // Track elapsed time for loader display
  const [elapsedTime, setElapsedTime] = useState(0);

  const defaultObjective = useMemo<Partial<CareerObjective>>(
    () => editingObjective || { career_objective: "" },
    [editingObjective]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(careerObjectiveSchema),
    defaultValues: {
      career_objective: defaultObjective.career_objective || "",
    },
  });

  useEffect(() => {
    reset({ career_objective: defaultObjective.career_objective || "" });
  }, [defaultObjective.career_objective, reset]);

  // Update elapsed time only while loading
  useEffect(() => {
    if (!loading) {
      setElapsedTime(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(interval);
  }, [loading]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      try {
        let savedObj: CareerObjective;

        if (editingObjective?.id && editingIndex !== undefined) {
          savedObj = await updateCareerObjective(editingObjective.id, {
            career_objective: data.career_objective,
          });
        } else {
          savedObj = await submitCareerObjective({
            ...defaultObjective,
            career_objective: data.career_objective,
          } as CareerObjective);
        }

        onDone(savedObj);
        reset({ career_objective: data.career_objective });
      } catch (error) {
        console.error("Error saving career objective:", error);
      }
    });
  };

  return (
    <div className="border rounded-lg bg-white relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-4 m-4 relative"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Career Objective *
          <textarea
            {...register("career_objective")}
            placeholder="e.g., To secure a challenging role as a Software Developer where I can apply my coding skills and grow professionally."
            disabled={loading}
            className={`w-full h-24 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 mt-4 ${
              errors.career_objective
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            } disabled:opacity-50`}
          />
        </label>

        {errors.career_objective && (
          <p className="text-red-500 text-sm">
            {errors.career_objective.message}
          </p>
        )}

        <Button
          onClick={() => {}}
          type="submit"
          label={loading ? "Saving..." : editingObjective ? "Update" : "Save"}
          disabled={loading}
        />

        {/* Reusable Loader with elapsed time */}
        <Loader
          loading={loading}
          message={
            loading
              ? `Saving your career objective... (${elapsedTime}s elapsed)`
              : ""
          }
        />
      </form>
    </div>
  );
};

export default CareerObjectiveFormDetails;
