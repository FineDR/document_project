/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FaX } from "react-icons/fa6";
import Button from "../formElements/Button";
import { skillsSchema } from "./cvValidationSchema";
import { submitSkills, updateSkill, deleteSkill, type SkillsPayload } from "../../api/submitSkills";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import type { SkillSet, Skill } from "../../types/cv/cv";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import { updateSkills as updateSkillsInStore } from "../../store/cvSlice";

export type SkillsFormFields = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  skillSet?: SkillSet;
  onClose: () => void;
  onUpdate?: (updatedSkillSet: SkillSet) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skillSet, onClose, onUpdate }) => {
  const { loading, withLoader } = useTimedLoader(5000);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const technicalDefault = useMemo(
    () => skillSet?.technical_skills?.map((s) => ({ value: s.value, id: s.id })) || [{ value: "" }],
    [skillSet]
  );
  const softDefault = useMemo(
    () => skillSet?.soft_skills?.map((s) => ({ value: s.value, id: s.id })) || [{ value: "" }],
    [skillSet]
  );

  const { register, control, handleSubmit, reset } = useForm<SkillsFormFields>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { technicalSkills: technicalDefault, softSkills: softDefault },
  });

  const technicalFieldsArray = useFieldArray({ control, name: "technicalSkills" });
  const softFieldsArray = useFieldArray({ control, name: "softSkills" });

  useEffect(() => {
    reset({ technicalSkills: technicalDefault, softSkills: softDefault });
  }, [reset, technicalDefault, softDefault]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return <p className="text-red-500 text-center">Not logged in</p>;

  const handleDeleteSkill = async (
    type: "technical" | "soft",
    index: number,
    skillId?: number
  ) => {
    // Remove from field array
    if (type === "technical") technicalFieldsArray.remove(index);
    else softFieldsArray.remove(index);

    // If skill exists in backend, delete it there too
    if (skillId) {
      try {
        await deleteSkill(skillId);
        const updatedSkillSet: SkillSet = {
          ...skillSet!,
          technical_skills:
            type === "technical"
              ? skillSet!.technical_skills.filter((_, i) => i !== index)
              : skillSet!.technical_skills,
          soft_skills:
            type === "soft"
              ? skillSet!.soft_skills.filter((_, i) => i !== index)
              : skillSet!.soft_skills,
        };
        onUpdate?.(updatedSkillSet);
        dispatch(updateSkillsInStore({ skillSet: updatedSkillSet }));
      } catch (err) {
        console.error("Failed to delete skill:", err);
      }
    }
  };

  const onSubmit: SubmitHandler<SkillsFormFields> = async (data) => {
    if (!user) return;
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        const full_name = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");
        const payload: SkillsPayload = {
          technicalSkills: data.technicalSkills.map((s) => ({ value: s.value, id: (s as any).id })),
          softSkills: data.softSkills.map((s) => ({ value: s.value, id: (s as any).id })),
          email: user.email,
          full_name,
        };

        const savedData = skillSet?.id ? await updateSkill(skillSet.id, payload) : await submitSkills(payload);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const updatedSkillSet: SkillSet = {
          id: skillSet?.id ?? savedData.id,
          technical_skills: savedData.technicalSkills ?? skillSet?.technical_skills ?? [],
          soft_skills: savedData.softSkills ?? skillSet?.soft_skills ?? [],
          full_name,
          email: user.email,
          user: user.id,
        };

        reset({
          technicalSkills: updatedSkillSet.technical_skills.map((s) => ({ value: s.value, id: s.id })),
          softSkills: updatedSkillSet.soft_skills.map((s) => ({ value: s.value, id: s.id })),
        });

        onUpdate?.(updatedSkillSet);
        dispatch(updateSkillsInStore({ skillSet: updatedSkillSet }));
        setSuccessMessage(skillSet ? "✅ Skills updated successfully." : "✅ Skills saved successfully.");
        onClose();
      } catch (error) {
        console.error("Error submitting skills:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  return (
    <section className="w-full mx-auto p-6 bg-whiteBg border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Skills</h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Enter your skills clearly. Separate technical skills (tools, frameworks) and soft skills (communication, teamwork, leadership). Required fields are marked with *.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Technical Skills */}
        <div>
          <h3 className="font-semibold mb-2">Technical Skills</h3>
          {technicalFieldsArray.fields.map((field, index) => (
            <div key={field.id} className="relative mb-4">
              <input
                {...register(`technicalSkills.${index}.value`)}
                placeholder="e.g., React, Node.js"
                className="border p-2 rounded w-full pr-8"
                disabled={loading}
              />
              {technicalFieldsArray.fields.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteSkill("technical", index, (field as any).id);
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <FaX />
                </button>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Enter a technical skill or technology you are proficient in.
              </p>
            </div>
          ))}
          <Button
            type="button"
            label="+ Add Technical Skill"
            onClick={() => technicalFieldsArray.append({ value: "" })}
            disabled={loading}
          />
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className="font-semibold mb-2">Soft Skills</h3>
          {softFieldsArray.fields.map((field, index) => (
            <div key={field.id} className="relative mb-4">
              <input
                {...register(`softSkills.${index}.value`)}
                placeholder="e.g., Communication"
                className="border p-2 rounded w-full pr-8"
                disabled={loading}
              />
              {softFieldsArray.fields.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteSkill("soft", index, (field as any).id);
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  <FaX />
                </button>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Enter a soft skill like teamwork, communication, or leadership.
              </p>
            </div>
          ))}
          <Button
            type="button"
            label="+ Add Soft Skill"
            onClick={() => softFieldsArray.append({ value: "" })}
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          onClick={()=>{}}
          label={skillSet ? "Update Skills" : "Save Skills"}
          disabled={loading}
        />

        <Loader
          loading={loading}
          message={loading ? `Processing skills... (${elapsedTime}s elapsed)` : ""}
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
          {successMessage}
        </div>
      )}
    </section>
  );
};

export default SkillsForm;
