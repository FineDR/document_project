/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaX } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import Loader from "../common/Loader";

import { achievementsSchema } from "../forms/cvValidationSchema";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import type { Achievement } from "../../types/cv/cv";

import {
  addAchievement,
  editAchievement,
} from "../../features/achievements/achievementsSlice";

type FormFields = z.infer<typeof achievementsSchema>;

interface Props {
  editingAchievement?: Achievement;
  onDone?: (updatedAchievement?: Achievement) => void;
}

const AchievementFormDetails = ({ editingAchievement, onDone }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: {
      achievement: editingAchievement
        ? [{ value: editingAchievement.value }]
        : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievement",
  });

  const { loading, withLoader } = useTimedLoader(3000);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const full_name = user
    ? [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ")
    : "";

  useEffect(() => {
    if (editingAchievement) {
      reset({
        achievement: [{ value: editingAchievement.value }],
      });
    }
  }, [editingAchievement, reset]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  if (!user) return <p className="text-red-500">Not logged in</p>;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      setSuccessMsg("");
      setErrorMsg("");

      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);

      const payload = {
        achievements: data.achievement,
        full_name,
        email: user.email,
      };

      try {
        let message = "";
        let updatedAchievement: Achievement | undefined;

        if (editingAchievement?.id) {
          const resultAction = await dispatch(
            editAchievement({ id: editingAchievement.id, data: payload })
          );
          if (editAchievement.fulfilled.match(resultAction)) {
            updatedAchievement = resultAction.payload;
            message = "Achievement updated successfully ✅";
          } else {
            throw new Error("Update failed");
          }
        } else {
          const resultAction = await dispatch(addAchievement(payload));
          if (addAchievement.fulfilled.match(resultAction)) {
            updatedAchievement = resultAction.payload;
            message = "Achievement saved successfully ✅";
          } else {
            throw new Error("Save failed");
          }
        }

        reset({ achievement: [{ value: "" }] });
        setSuccessMsg(message);
        onDone?.(updatedAchievement);
      } catch (error) {
        console.error("Error saving achievement:", error);
        setErrorMsg("Failed to save achievement ❌");
      } finally {
        clearInterval(interval);
      }
    });
  };

  return (
    <div className="p-4 border rounded-lg relative m-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
        {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
      </h2>

      {/* Guidance message at top */}
      <p className="text-gray-600 text-sm mb-4 text-center">
        Add your personal or professional achievements — for example, awards,
        recognitions, completed certifications, or big projects.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dynamic Achievement Fields */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start w-full">
              <div className="flex-1 w-full">
                <InputField
                  type="text"
                  label={`Achievement ${index + 1} *`}
                  placeholder="e.g., Winner of National Coding Competition"
                  name={`achievement.${index}.value`}
                  register={register(`achievement.${index}.value`)}
                  error={errors.achievement?.[index]?.value?.message}
                  disabled={loading}
                  autoFocus={index === fields.length - 1}
                  helperText="Tip: Include awards, certifications, completed projects, or any personal milestones."
                />
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 px-3 py-1 mt-1 hover:text-red-700 transition-colors"
                  disabled={loading}
                  title="Remove achievement"
                >
                  <FaX />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => append({ value: "" })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            label="+ Add Achievement"
            disabled={loading}
          />
          <Button
            type="submit"
            onClick={() => {}}
            label={editingAchievement ? "Update" : "Save"}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-500/80 disabled:opacity-50"
            disabled={loading}
          />
        </div>

        {/* Loader */}
        <Loader
          loading={loading}
          message={
            loading
              ? `Saving your achievements... (${elapsedTime}s elapsed)`
              : ""
          }
        />

        {/* Messages */}
        {successMsg && (
          <div className="mt-4 text-green-600 text-center font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 text-red-600 text-center font-medium">
            {errorMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default AchievementFormDetails;
