/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../formElements/InputField";
import SelectInputField from "../formElements/SelectInputField";
import Button from "../formElements/Button";
import { languagesSchema } from "../forms/cvValidationSchema";
import { submitLanguages, updateLanguage } from "../../api/languages";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { z } from "zod";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";

type FormFields = z.infer<typeof languagesSchema>;

interface Props {
  editingLanguage?: { id: number; language: string; proficiency: string };
  onDone?: () => void;
}

const proficiencyOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Fluent", value: "Fluent" },
  { label: "Native", value: "Native" },
];

const LanguagesFormDetails = ({ editingLanguage, onDone }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(languagesSchema),
    defaultValues: { languages: [{ language: "", proficiency: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const [successMessage, setSuccessMessage] = useState("");

  const { loading, withLoader } = useTimedLoader(3000);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset form for editing or new entry
  useEffect(() => {
    if (editingLanguage) {
      reset({
        languages: [
          {
            language: editingLanguage.language,
            proficiency: editingLanguage.proficiency,
          },
        ],
      });
    } else {
      reset({ languages: [{ language: "", proficiency: "" }] });
    }
  }, [editingLanguage, reset]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return <p className="text-red-500">Not logged in</p>;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);

      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);

      const payload = {
        ...data,
        full_name: [user.first_name, user.middle_name, user.last_name]
          .filter(Boolean)
          .join(" "),
        email: user.email,
      };

      try {
        let message = "";
        if (editingLanguage) {
          await updateLanguage(editingLanguage.id, payload.languages[0]);
          message = "✅ Language updated successfully.";
        } else {
          await submitLanguages(payload);
          message = "✅ Languages submitted successfully.";
        }
        reset({ languages: [{ language: "", proficiency: "" }] });
        setSuccessMessage(message);
        onDone?.();
      } catch (error) {
        console.error("Error submitting languages:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  return (
    <div className="p-4 border rounded-lg mb-4 relative">
      {/* Top guidance message */}
      <p className="text-gray-600 text-sm mb-4 text-center">
        Add the languages you know and indicate your proficiency level. For example, English (Fluent), Swahili (Native), French (Intermediate).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 p-4 relative">
            <InputField
              type="text"
              label="Language *"
              placeholder="e.g., English, Swahili, French"
              name={`languages.${index}.language`}
              register={register(`languages.${index}.language` as const)}
              error={errors.languages?.[index]?.language?.message}
              disabled={loading}
              helperText="Enter the language name."
            />

            <SelectInputField<FormFields>
              label="Proficiency *"
              name={`languages.${index}.proficiency`}
              register={register}
              options={proficiencyOptions}
              error={errors.languages?.[index]?.proficiency}
              disabled={loading}
            />

            {fields.length > 1 && !editingLanguage && (
              <Button
                type="button"
                label="Remove"
                onClick={() => remove(index)}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={loading}
              />
            )}
          </div>
        ))}

        <div className="flex gap-4 flex-wrap">
          {!editingLanguage && (
            <Button
              type="button"
              label="+ Add Language"
              onClick={() => append({ language: "", proficiency: "" })}
              disabled={loading}
            />
          )}

          <Button
            type="submit"
            label={editingLanguage ? "Update" : "Submit"}
            disabled={loading}
            onClick={() => {}}
          />
        </div>

        {/* Loader with elapsed time */}
        <Loader
          loading={loading}
          message={loading ? `Processing languages... (${elapsedTime}s elapsed)` : ""}
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default LanguagesFormDetails;
