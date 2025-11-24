/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaX } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import Loader from "../common/Loader";

import { achievementsSchema } from "../forms/cvValidationSchema";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import type { Achievement } from "../../types/cv/types";
import z from "zod";

import { addAchievement, editAchievement } from "../../features/achievements/achievementsSlice";
import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { generateCV } from "../../features/auth/authSlice";
import { aiTemplates } from "../../utils/aiTemplates";
type FormFields = z.infer<typeof achievementsSchema>;
type AIAchievementsData = {
  achievements: { value: string }[];
} | null;
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

  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<AIAchievementsData>(null);
  const [isAILoading, setAILoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("achievements");

  const methods = useForm<FormFields>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: {
      achievement: editingAchievement ? [{ value: editingAchievement.value }] : [{ value: "" }],
    },
  });

  const { register, control, handleSubmit, reset, formState: { errors }, setValue } = methods;
  const { fields, append, remove, replace } = useFieldArray({ control, name: "achievement" });

  // Prefill form if editingAchievement changes
  useEffect(() => {
    if (editingAchievement) {
      replace([{ value: editingAchievement.value }]);
    }
  }, [editingAchievement, replace]);

  // Clear success messages after timeout
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  if (!user) return <p className="text-red-500 text-center">Not logged in</p>;

  /* --------------------------------------------------------
      FORM SUBMIT HANDLER
  -------------------------------------------------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      setSuccessMsg("");
      setErrorMsg("");

      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      const payload: Achievement = {
        value: data.achievement.map(a => a.value).join("; "),
        profile: user.id,
        id: editingAchievement ? editingAchievement.id : 0,
      };

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

  /* --------------------------------------------------------
      AI HANDLERS
  -------------------------------------------------------- */
  const handleGenerateAchievementsFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      const prompt = buildAIPromptDynamic("achievements", { instruction_text: instructionText });

      // Call backend
      const resultAction = await dispatch(
        generateCV({
          section: "achievements",
          userData: { instruction_text: prompt },
        })
      ).unwrap();
      
      // Parse response; backend returns { achievements: [...] }
      const parsedData: AIAchievementsData =
        typeof resultAction === "string" ? JSON.parse(resultAction) : resultAction;

      // Ensure array of objects
      const achievements = parsedData?.achievements?.map(a =>
        typeof a === "string" ? { value: a } : a
      ) || [];

      setAIData({ achievements }); // ✅ Object for preview modal
      setAIModalOpen(false);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Error generating AI achievements:", err);
    } finally {
      setAILoading(false);
    }
  };

  const handleAcceptAchievementsAI = () => {
    if (!aiData?.achievements || !Array.isArray(aiData.achievements)) return;

    // Replace the form field array
    replace(aiData.achievements.map(a => ({ value: a.value || "" })));

    setSuccessMsg("✅ AI-generated achievements populated. You can review before submitting.");
    setPreviewOpen(false);
    setAIData(null);
  };

  /* --------------------------------------------------------
      RENDER
  -------------------------------------------------------- */
  return (
    <FormProvider {...methods}>
      <div className="p-6 border rounded-md bg-whiteBg shadow-md w-full mx-auto">
        <h2 className="text-h2 font-semibold text-center mb-4">
          {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
        </h2>

        <p className="text-subHeadingGray text-sm mb-6 text-center">
          Add personal or professional achievements, awards, recognitions, certifications, or big projects.
        </p>

        {/* AI Button */}
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            label="✨ Suggest with AI"
            onClick={() => setAIModalOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col items-start gap-2">
                <InputField
                  type="text"
                  label={`Achievement ${index + 1} *`}
                  placeholder="e.g., Winner of National Coding Competition"
                  name={`achievement.${index}.value`}
                  register={register(`achievement.${index}.value`)}
                  error={errors.achievement?.[index]?.value?.message}
                  disabled={loading}
                  autoFocus={index === fields.length - 1}
                />
                <p className="text-gray-400 text-xs italic mt-1">Include awards, certifications, completed projects, or personal milestones.</p>
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

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => append({ value: "" })}
              label="+ Add Achievement"
              disabled={loading}
              className="text-white px-4 py-2"
            />
            <Button
              type="submit"
              onClick={() => { }}
              label={editingAchievement ? "Update" : "Save"}
              disabled={loading}
              className="text-white"
            />
          </div>

          <Loader
            loading={loading}
            message={loading ? `Saving your achievements... (${elapsedTime}s elapsed)` : ""}
          />

          {successMsg && <p className="text-green-600 text-center mt-4 font-medium">{successMsg}</p>}
          {errorMsg && <p className="text-redMain text-center mt-4 font-medium">{errorMsg}</p>}
        </form>

        {/* --- AI Modals --- */}
        <AIInputModal
          isOpen={isAIModalOpen}
          onClose={() => setAIModalOpen(false)}
          onSubmit={handleGenerateAchievementsFromAI}
          loading={isAILoading}
          defaultText={aiTemplates[currentSection]} // <-- template for that section
          title={`Edit ${currentSection.replace("_", " ")}`}
          description="You can edit this text. AI will extract the info and fill the form."
          placeholder="I have completed projects in React, Node.js and won competitions."
          generateLabel="Generate Achievements"
          cancelLabel="Cancel"
        />

        <AIPreviewModal
          isOpen={isPreviewOpen}
          data={aiData}
          onClose={() => setPreviewOpen(false)}
          onAccept={handleAcceptAchievementsAI}
          title="Review AI-Generated Achievements"
          description="Confirm the AI-generated achievements before populating the form."
          acceptLabel="Accept & Populate"
          discardLabel="Discard"
        />
      </div>
    </FormProvider>
  );
};

export default AchievementFormDetails;
