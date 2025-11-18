/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FaX } from "react-icons/fa6";
import Button from "../formElements/Button";
import InputField from "../formElements/InputField";
import { skillsSchema } from "./cvValidationSchema";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import type { SkillSet, Skill } from "../../types/cv/cv";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

import {
  fetchSkills,
  deleteSkillById,
  // new actions:
  createSkillSet,
  updateSkillSet,
} from "../../features/skills/skillsSlice";

export type SkillsFormFields = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  skillSet?: SkillSet;
  onClose: () => void;
  onUpdate?: (updatedSkillSet: SkillSet) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skillSet, onClose, onUpdate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { skills, loading } = useSelector((state: RootState) => state.skills);

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
     defaultValues: {
    technicalSkills: technicalDefault.length > 0 ? technicalDefault : [],
    softSkills: softDefault.length > 0 ? softDefault : [],
  },
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
    // remove from UI form state immediately
    if (type === "technical") technicalFieldsArray.remove(index);
    else softFieldsArray.remove(index);

    // If this skill already exists on backend, delete it via skill endpoint
    // We kept deleteSkillById thunk as-is for individual deletions
    if (skillId) {
      try {
        await dispatch(deleteSkillById(skillId)).unwrap();

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
      } catch (err) {
        console.error("Failed to delete skill:", err);
      }
    }
  };

  const buildPayload = (data: SkillsFormFields) => {
    const technicalSkills = (data.technicalSkills || [])
      .map((s) => ({ value: s.value?.trim() }))
      .filter((s) => s.value && s.value.length > 0);

    const softSkills = (data.softSkills || [])
      .map((s) => ({ value: s.value?.trim() }))
      .filter((s) => s.value && s.value.length > 0);

    return { technicalSkills, softSkills };
  };


  const onSubmit: SubmitHandler<SkillsFormFields> = async (data) => {
    // keep console debugging (helpful)
    // console.log("Submitting skills payload:", JSON.stringify(data, null, 2));
    if (!user) return;

    const payload = buildPayload(data);

    // prevent empty submission
    if (payload.technicalSkills.length === 0 && payload.softSkills.length === 0) {
      setSuccessMessage("Please add at least one skill before saving.");
      return;
    }

    const startTime = Date.now();
    setElapsedTime(0);
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

    try {
      let result: any;

      if (skillSet && skillSet.id) {
        // update existing skill set
        result = await dispatch(updateSkillSet({ id: skillSet.id, data: payload })).unwrap();
      } else {
        // create new skill set
        result = await dispatch(createSkillSet(payload)).unwrap();
      }

      // result should be the updated/created SkillSet returned by backend
      const updatedSkillSet: SkillSet = {
        id: result.id,
        technical_skills: (result.technicalSkills || result.technical_skills || []).map((t: any) => ({
          id: t.id,
          value: t.value,
        })),
        soft_skills: (result.softSkills || result.soft_skills || []).map((s: any) => ({
          id: s.id,
          value: s.value,
        })),
        full_name: result.full_name ?? [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" "),
        email: result.email ?? user.email,
        user: result.user ?? user.id,
      };

      // reset form to the values returned by backend (so ids are preserved)
      reset({
        technicalSkills: updatedSkillSet.technical_skills.map((s) => ({ value: s.value, id: s.id })),
        softSkills: updatedSkillSet.soft_skills.map((s) => ({ value: s.value, id: s.id })),
      });

      onUpdate?.(updatedSkillSet);
      setSuccessMessage(skillSet ? "✅ Skills updated successfully." : "✅ Skills saved successfully.");
    } catch (error: any) {
      console.error("Error submitting skills:", error);
      const message = typeof error === "string" ? error : error?.message || "Failed to save skills.";
      setSuccessMessage(`❌ ${message}`);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <section className="w-full mx-auto p-6 bg-whiteBg border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Skills</h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Enter your skills clearly. Separate technical skills (tools, frameworks) and soft skills (communication, teamwork, leadership). Required fields are marked with * ,this section is (Optional you can opt it).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Technical Skills */}
        <div>
          <h3 className="font-semibold mb-2">Technical Skills</h3>
          {technicalFieldsArray.fields.map((field, index) => (
            <div key={field.id} className="relative mb-4">
              <InputField
                name={`technicalSkills.${index}.value`}
                type="text"
                register={register(`technicalSkills.${index}.value`)}
                placeholder="e.g., React, Node.js (Optional)"
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
              <p className="text-gray-400 italic text-xs mt-1">
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
              <InputField
                name={`softSkills.${index}.value`}
                type="text"
                register={register(`softSkills.${index}.value`)}
                placeholder="e.g., Communication (Optional)"
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
              <p className="text-gray-400 italic text-xs mt-1">
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
          label={skillSet ? "Submit Skills" : "Save Skills"}
          disabled={loading}
          onClick={() => { }}
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
