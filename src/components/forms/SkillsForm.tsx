/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FaX } from "react-icons/fa6";
import Button from "../formElements/Button";
import { skillsSchema } from "./cvValidationSchema";
import {
  submitSkills,
  updateSkill,
  deleteSkill,
  type SkillsPayload,
} from "../../api/submitSkills";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import type { SkillSet, Skill } from "../../types/cv/cv";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import { updateSkills as updateSkillsInStore } from "../../store/cvSlice";

export type SkillsFormFields = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  skillSet?: SkillSet; // for editing
  onClose: () => void;
  onUpdate?: (updatedSkillSet: SkillSet) => void; // optional callback with updated data
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skillSet,
  onClose,
  onUpdate,
}) => {
  const { loading, withLoader } = useTimedLoader(5000); // 1500ms minimum display
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const technicalDefault = useMemo(
    () =>
      skillSet?.technical_skills?.map((s) => ({ value: s.value })) || [
        { value: "" },
      ],
    [skillSet]
  );
  const softDefault = useMemo(
    () =>
      skillSet?.soft_skills?.map((s) => ({ value: s.value })) || [
        { value: "" },
      ],
    [skillSet]
  );

  const { register, control, handleSubmit, reset } = useForm<SkillsFormFields>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      technicalSkills: technicalDefault,
      softSkills: softDefault,
    },
  });

  const technicalFieldsArray = useFieldArray({
    control,
    name: "technicalSkills",
  });
  const softFieldsArray = useFieldArray({ control, name: "softSkills" });

  useEffect(() => {
    reset({
      technicalSkills: technicalDefault,
      softSkills: softDefault,
    });
  }, [reset, technicalDefault, softDefault]);

  if (!user) return <p>Not logged in</p>;

  const handleDeleteSkill = async (
    type: "technical" | "soft",
    index: number
  ) => {
    if (!skillSet) return;

    const skill: Skill | undefined =
      type === "technical"
        ? skillSet.technical_skills[index]
        : skillSet.soft_skills[index];

    if (skill?.id) {
      try {
        await deleteSkill(skill.id);

        type === "technical"
          ? technicalFieldsArray.remove(index)
          : softFieldsArray.remove(index);

        const updatedSkillSet: SkillSet = {
          ...skillSet,
          technical_skills:
            type === "technical"
              ? skillSet.technical_skills.filter((_, i) => i !== index)
              : skillSet.technical_skills,
          soft_skills:
            type === "soft"
              ? skillSet.soft_skills.filter((_, i) => i !== index)
              : skillSet.soft_skills,
        };

        // Update parent callback
        onUpdate?.(updatedSkillSet);

        // Update Redux store
        dispatch(updateSkillsInStore({ skillSet: updatedSkillSet }));
      } catch (err) {
        console.error("Failed to delete skill:", err);
      }
    } else {
      type === "technical"
        ? technicalFieldsArray.remove(index)
        : softFieldsArray.remove(index);
    }
  };

const onSubmit: SubmitHandler<SkillsFormFields> = async (data) => {
  if (!user) return;

  try {
    await withLoader(async () => {
      const full_name = [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ");

      const payload: SkillsPayload = {
        technicalSkills: data.technicalSkills.map((s, i) => ({
          value: s.value,
          id: skillSet?.technical_skills?.[i]?.id,
        })),
        softSkills: data.softSkills.map((s, i) => ({
          value: s.value,
          id: skillSet?.soft_skills?.[i]?.id,
        })),
        email: user.email,
        full_name,
      };

      // API call
      const savedData = skillSet?.id
        ? await updateSkill(skillSet.id, payload)
        : await submitSkills(payload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ✅ Merge new with old instead of overwriting
      const updatedSkillSet: SkillSet = {
        id: skillSet?.id ?? savedData.id,
        technical_skills:
          savedData.technicalSkills ?? skillSet?.technical_skills ?? [],
        soft_skills:
          savedData.softSkills ?? skillSet?.soft_skills ?? [],
        full_name,
        email: user.email,
        user: user.id,
      };

      reset({
        technicalSkills: updatedSkillSet.technical_skills.map((s) => ({
          value: s.value,
        })),
        softSkills: updatedSkillSet.soft_skills.map((s) => ({
          value: s.value,
        })),
      });

      onUpdate?.(updatedSkillSet);
      dispatch(updateSkillsInStore({ skillSet: updatedSkillSet }));
      onClose();
    });
  } catch (error: any) {
    console.error("Error submitting skills:", error);
  }
};


  return (
    <div className="p-4 border rounded-lg bg-white relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Technical Skills</h3>
          {technicalFieldsArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`technicalSkills.${index}.value`)}
                placeholder="e.g., React, Node.js"
                className="border p-2 rounded w-full"
                disabled={loading}
              />
              {technicalFieldsArray.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSkill("technical", index)}
                  className="text-red-500"
                  disabled={loading}
                >
                  <FaX className="mb-8 text-sm" />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            label="+ Add Technical Skill"
            onClick={() => technicalFieldsArray.append({ value: "" })}
            disabled={loading}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Soft Skills</h3>
          {softFieldsArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`softSkills.${index}.value`)}
                placeholder="e.g., Communication"
                className="border p-2 rounded w-full"
                disabled={loading}
              />
              {softFieldsArray.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSkill("soft", index)}
                  className="text-red-500"
                  disabled={loading}
                >
                  <FaX className="mb-8 text-sm" />
                </button>
              )}
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
          label={
            loading
              ? "Submitting..."
              : skillSet
              ? "Update Skills"
              : "Save Skills"
          }
          disabled={loading}
        />

        <Loader loading={loading} message="Saving your skills..." />
      </form>
    </div>
  );
};

export default SkillsForm;
