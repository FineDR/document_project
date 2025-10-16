/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { referencesSchema } from "../forms/cvValidationSchema";
import { submitReferences, updateReference } from "../../api/references";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";

type FormFields = z.infer<typeof referencesSchema>;

interface Props {
  editingReference?: any;
  editingIndex?: number | null;
  onDone?: () => void;
}

const ReferencesFormDetails = ({ editingReference, editingIndex, onDone }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(3000);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(referencesSchema),
    defaultValues: {
      references: [{ name: "", position: "", email: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "references",
  });

  // Prefill form if editing
  useEffect(() => {
    if (editingReference) {
      reset({
        references: [
          {
            name: editingReference.name,
            position: editingReference.position,
            email: editingReference.email,
            phone: editingReference.phone,
          },
        ],
      });
    } else {
      reset({ references: [{ name: "", position: "", email: "", phone: "" }] });
    }
  }, [editingReference, reset]);

  // Clear success message after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return <p className="text-red-500 text-center">Not logged in</p>;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      const payload = {
        ...data,
        full_name: [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" "),
        email: user.email,
      };

      try {
        let message = "";

        if (editingReference && editingIndex !== null) {
          await updateReference(editingReference.id, payload.references[0]);
          message = "✅ Reference updated successfully.";
        } else {
          await submitReferences(payload);
          message = "✅ References submitted successfully.";
        }

        reset({ references: [{ name: "", position: "", email: "", phone: "" }] });
        setSuccessMessage(message);
        onDone?.();
      } catch (error) {
        console.error("Error submitting references:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  return (
    <section className="w-full mx-auto p-6 bg-whiteBg border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {editingReference ? "Edit Reference" : "Add Reference Details"}
      </h2>

      <p className="text-gray-600 text-sm mb-6 text-center">
        Add at least one reference — for example, previous managers, team leads, or colleagues. Include their position, email, and phone number. Required fields are marked with *.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4  space-y-4 relative">
            <InputField
              type="text"
              label="Referee Name *"
              placeholder="e.g., John Doe"
              name={`references.${index}.name`}
              register={register(`references.${index}.name` as const)}
              error={errors.references?.[index]?.name?.message}
              disabled={loading}
              helperText="Tip: Full name of your reference."
            />
            <InputField
              type="text"
              label="Position *"
              placeholder="e.g., Manager, Team Lead"
              name={`references.${index}.position`}
              register={register(`references.${index}.position` as const)}
              error={errors.references?.[index]?.position?.message}
              disabled={loading}
              helperText="Tip: Job title or position of your reference."
            />
            <InputField
              type="email"
              label="Email *"
              placeholder="e.g., example@gmail.com"
              name={`references.${index}.email`}
              register={register(`references.${index}.email` as const)}
              error={errors.references?.[index]?.email?.message}
              disabled={loading}
              helperText="Tip: Professional email address."
            />
            <InputField
              type="text"
              label="Phone Number *"
              placeholder="e.g., +255 123 456 789"
              name={`references.${index}.phone`}
              register={register(`references.${index}.phone` as const)}
              error={errors.references?.[index]?.phone?.message}
              disabled={loading}
              helperText="Tip: Contact number including country code."
            />

            {fields.length > 1 && !editingReference && (
              <Button
                type="button"
                label="Remove"
                onClick={() => remove(index)}
                disabled={loading}
                className="bg-red-500 text-white hover:bg-red-600 absolute bottom-2 right-2"
              />
            )}
          </div>
        ))}

        <div className="flex gap-4 flex-wrap">
          {!editingReference && (
            <Button
              type="button"
              label="+ Add Reference"
              onClick={() => append({ name: "", position: "", email: "", phone: "" })}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            />
          )}
          <Button
            type="submit"
            label={editingReference ? "Update" : "Submit"}
            disabled={loading}
            onClick={() => {}}
            className="bg-red-600 text-white hover:bg-red-700"
          />
        </div>

        <Loader
          loading={loading}
          message={loading ? `Processing references... (${elapsedTime}s elapsed)` : ""}
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

export default ReferencesFormDetails;
