/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerObjectiveSchema } from "./cvValidationSchema";
import type { CareerObjective } from "../../types/cv/cv";
import type { z } from "zod";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";
import Button from "../formElements/Button";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  addCareerObjective,
  updateCareerObjectiveById,
} from "../../features/carerobjectives/carerObjectivesSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.carerObjectives
  );

  const { loading: timedLoading, withLoader } = useTimedLoader(1500);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const isLoading = loading || timedLoading;

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

  // Reset field when editing objective changes
  useEffect(() => {
    reset({ career_objective: defaultObjective.career_objective || "" });
  }, [defaultObjective.career_objective, reset]);

  // Track elapsed time while loading
  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 100);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      try {
        let updatedObjective: CareerObjective;
        let message = "";

        if (editingObjective?.id && editingIndex !== undefined) {
          updatedObjective = await dispatch(
            updateCareerObjectiveById({
              id: editingObjective.id,
              data: { career_objective: data.career_objective },
            })
          ).unwrap();
          message = "Career objective updated successfully ✅";
        } else {
          updatedObjective = await dispatch(
            addCareerObjective({
              career_objective: data.career_objective,
            })
          ).unwrap();
          message = "Career objective saved successfully ✅";
        }

        // ✅ Clear textarea after saving
        reset({ career_objective: "" });
        setSuccessMessage(message);
        onDone(updatedObjective);
      } catch (err) {
        console.error("Error saving career objective:", err);
      }
    });
  };

  return (
    <div className="border rounded-lg bg-white relative">
      {/* Guidance message for user */}
      <h2 className="text-2xl text-center font-bold mt-4">Career Objective</h2>
      <p className="text-gray-600 text-sm mb-4 text-center mt-8">
        Enter a clear and concise career objective. Mention your desired role,
        skills, and how you can contribute to the organization. This will help
        recruiters understand your professional goals.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-4 m-4 relative"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Career Objective *
          <textarea
            {...register("career_objective")}
            placeholder="e.g., To secure a challenging role as a Software Developer where I can apply my coding skills and grow professionally."
            disabled={isLoading}
            className={`w-full h-24 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 mt-4 ${
              errors.career_objective
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            } disabled:opacity-50`}
          />
        </label>

        {/* Inline guidance for this field */}
        <p className="text-gray-500 text-xs mb-2">
          Tip: Keep it under 2–3 sentences. Highlight your main skill and
          career goal.
        </p>

        {errors.career_objective && (
          <p className="text-red-500 text-sm">
            {errors.career_objective.message}
          </p>
        )}

        <Button
          type="submit"
          onClick={() => {}}
          label={isLoading ? "Saving..." : editingObjective ? "Update" : "Save"}
          disabled={isLoading}
        />

        <Loader
          loading={isLoading}
          message={
            isLoading
              ? `Saving your career objective... (${elapsedTime}s elapsed)`
              : ""
          }
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default CareerObjectiveFormDetails;
