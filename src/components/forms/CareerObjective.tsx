/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerObjectiveSchema } from "./cvValidationSchema";
import type { CareerObjective } from "../../types/cv/cv";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";
import Button from "../formElements/Button";
import z from "zod";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addCareerObjective, updateCareerObjectiveById } from "../../features/carerobjectives/carerObjectivesSlice";

type FormFields = z.infer<typeof careerObjectiveSchema>;

interface Props {
  editingObjective?: CareerObjective;
  editingIndex?: number;
  onDone: (updated: CareerObjective) => void;
}

const CareerObjectiveFormDetails = ({ editingObjective, editingIndex, onDone }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: reduxLoading, error } = useSelector((state: RootState) => state.carerObjectives);
  const { loading: timedLoading, withLoader } = useTimedLoader(1500);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const isLoading = reduxLoading || timedLoading;

  // Memoize default values
  const defaultObjective = useMemo<Partial<CareerObjective>>(
    () => editingObjective || { career_objective: "" },
    [editingObjective]
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(careerObjectiveSchema),
    defaultValues: { career_objective: defaultObjective.career_objective || "" },
  });

  // Reset form when editing objective changes
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
            addCareerObjective({ career_objective: data.career_objective })
          ).unwrap();
          message = "Career objective saved successfully ✅";
        }

        reset({ career_objective: "" });
        setSuccessMessage(message);
        onDone(updatedObjective);
      } catch (err) {
        console.error("Error saving career objective:", err);
      }
    });
  };

  return (
    <div className="p-6 border rounded-md bg-whiteBg shadow-sm w-full mx-auto">
      <h2 className="text-h2 font-semibold text-center mb-4">Career Objective</h2>

      <p className="text-subHeadingGray text-sm mb-6 text-center">
        Enter a clear and concise career objective highlighting your desired role, skills, and contribution to the organization.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">
            Career Objective *
            <textarea
              {...register("career_objective")}
              placeholder="e.g., To secure a challenging role as a Software Developer where I can apply my coding skills and grow professionally."
              disabled={isLoading}
              className={`w-full h-28 p-3 mt-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.career_objective
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              } disabled:opacity-50`}
            />
          </label>
          <p className="text-gray-500 text-xs mt-1">
            Tip: Keep it under 2–3 sentences. Highlight your main skill and career goal.
          </p>
          {errors.career_objective && (
            <p className="text-red-500 text-sm mt-1">{errors.career_objective.message}</p>
          )}
        </div>

        <Button
          type="submit"
          onClick={()=>{}}
          label={isLoading ? "Saving..." : editingObjective ? "Update" : "Save"}
          disabled={isLoading}
          className="bg-redMain text-white px-6 py-2 rounded hover:bg-redMain/80 disabled:opacity-50"
        />

        <Loader
          loading={isLoading}
          message={isLoading ? `Saving your career objective... (${elapsedTime}s elapsed)` : ""}
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default CareerObjectiveFormDetails;
