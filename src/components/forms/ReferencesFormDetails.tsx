/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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

  const user = useSelector((state: RootState) => state.auth.user);

  // Increase loader duration to 3 seconds
  const { loading, withLoader } = useTimedLoader(3000);
  const [elapsedTime, setElapsedTime] = useState(0);

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
      reset({
        references: [{ name: "", position: "", email: "", phone: "" }],
      });
    }
  }, [editingReference, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);

      // Track elapsed time for loader
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);

      try {
        const payload = {
          ...data,
          full_name: [user.first_name, user.middle_name, user.last_name]
            .filter(Boolean)
            .join(" "),
          email: user.email,
        };

        if (editingReference && editingIndex !== null) {
          await updateReference(editingReference.id, payload.references[0]);
        } else {
          await submitReferences(payload);
        }

        reset();
        onDone?.();
      } catch (error) {
        console.error("Error submitting references:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  if (!user) {
    return <p className="text-red-500">Not logged in</p>;
  }

  return (
    <div className="p-4 border rounded-lg relative">
      <h2 className="text-center text-primary text-2xl font-semibold mb-6">
        {editingReference ? "Edit Reference" : "Fill the References Details"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 relative space-y-4">
            <InputField
              type="text"
              label="Referee Name *"
              placeholder="e.g., John Doe"
              name={`references.${index}.name`}
              register={register(`references.${index}.name` as const)}
              error={errors.references?.[index]?.name?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="Position *"
              placeholder="e.g., Manager, Team Lead"
              name={`references.${index}.position`}
              register={register(`references.${index}.position` as const)}
              error={errors.references?.[index]?.position?.message}
              disabled={loading}
            />
            <InputField
              type="email"
              placeholder="e.g., finesawa@gmail.com"
              label="Email *"
              name={`references.${index}.email`}
              register={register(`references.${index}.email` as const)}
              error={errors.references?.[index]?.email?.message}
              disabled={loading}
            />
            <InputField
              type="text"
              label="Phone Number *"
              placeholder="e.g., +255 123 456 789"
              name={`references.${index}.phone`}
              register={register(`references.${index}.phone` as const)}
              error={errors.references?.[index]?.phone?.message}
              disabled={loading}
            />

            {fields.length > 1 && !editingReference && (
              <button
                type="button"
                className="absolute bottom-2 right-2 text-red-500 text-sm disabled:opacity-50"
                onClick={() => remove(index)}
                disabled={loading}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-4 flex-wrap mx-4">
          {!editingReference && (
            <Button
              type="button"
              label="Add Reference"
              onClick={() => append({ name: "", position: "", email: "", phone: "" })}
              disabled={loading}
            />
          )}
          <Button
            type="submit"
            onClick={() => {}}
            label={editingReference ? "Update" : "Submit"}
            disabled={loading}
          />
        </div>

        {/* Reusable Loader with elapsed time */}
        <Loader
          loading={loading}
          message={loading ? `Processing references... (${elapsedTime}s elapsed)` : ""}
        />
      </form>
    </div>
  );
};

export default ReferencesFormDetails;
