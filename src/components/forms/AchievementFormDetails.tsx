/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaX } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import Loader from "../common/Loader";

import { achievementsSchema } from "../forms/cvValidationSchema";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import type { Achievement } from "../../types/cv/cv";
import z from "zod";

import { addAchievement, editAchievement } from "../../features/achievements/achievementsSlice";

type FormFields = z.infer<typeof achievementsSchema>;

interface Props {
  editingAchievement?: Achievement;
  onDone?: (updatedAchievement?: Achievement) => void;
}

const AchievementFormDetails = ({ editingAchievement, onDone }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const { loading, withLoader } = useTimedLoader(3000);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const full_name = user
    ? [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ")
    : "";

  // React Hook Form setup
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: {
      achievement: editingAchievement ? [{ value: editingAchievement.value }] : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievement",
  });

  // Reset form when editingAchievement changes
  useEffect(() => {
    if (editingAchievement) {
      reset({ achievement: [{ value: editingAchievement.value }] });
    }
  }, [editingAchievement, reset]);

  // Clear success messages after a timeout
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  if (!user) return <p className="text-red-500 text-center">Not logged in</p>;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      setSuccessMsg("");
      setErrorMsg("");

      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      const payload = { achievements: data.achievement, full_name, email: user.email };

      try {
        let updatedAchievement: Achievement | undefined;
        let message = "";

        if (editingAchievement?.id) {
          const resultAction = await dispatch(editAchievement({ id: editingAchievement.id, data: payload }));
          if (editAchievement.fulfilled.match(resultAction)) {
            updatedAchievement = resultAction.payload;
            message = "Achievement updated successfully ✅";
          } else throw new Error("Update failed");
        } else {
          const resultAction = await dispatch(addAchievement(payload));
          if (addAchievement.fulfilled.match(resultAction)) {
            updatedAchievement = resultAction.payload;
            message = "Achievement saved successfully ✅";
          } else throw new Error("Save failed");
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
    <div className="p-6 border rounded-md bg-whiteBg shadow-md w-full mx-auto">
      <h2 className="text-h2 font-semibold text-center mb-4">
        {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
      </h2>

      <p className="text-subHeadingGray text-sm mb-6 text-center">
        Add personal or professional achievements, awards, recognitions, certifications, or big projects.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dynamic Achievement Inputs */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <InputField
                type="text"
                label={`Achievement ${index + 1} *`}
                placeholder="e.g., Winner of National Coding Competition"
                name={`achievement.${index}.value`}
                register={register(`achievement.${index}.value`)}
                error={errors.achievement?.[index]?.value?.message}
                disabled={loading}
                autoFocus={index === fields.length - 1}
                helperText="Include awards, certifications, completed projects, or personal milestones."
              />

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={loading}
                  className="text-redMain hover:text-red-600 transition-colors mt-1"
                  title="Remove achievement"
                >
                  <FaX />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => append({ value: "" })}
            label="+ Add Achievement"
            disabled={loading}
            className="bg-redMain text-white px-4 py-2 rounded hover:bg-redMain/80 disabled:opacity-50"
          />
          <Button
            type="submit"
            onClick={()=>{}}
            label={editingAchievement ? "Update" : "Save"}
            disabled={loading}
            className="bg-redMain text-white px-6 py-2 rounded hover:bg-redMain/80 disabled:opacity-50"
          />
        </div>

        {/* Loader */}
        <Loader
          loading={loading}
          message={loading ? `Saving your achievements... (${elapsedTime}s elapsed)` : ""}
        />

        {/* Success/Error Messages */}
        {successMsg && <p className="text-green-600 text-center mt-4 font-medium">{successMsg}</p>}
        {errorMsg && <p className="text-redMain text-center mt-4 font-medium">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default AchievementFormDetails;
