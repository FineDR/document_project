/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { referencesSchema } from "../forms/cvValidationSchema";
import Loader from "../common/Loader";
import { aiTemplates } from "../../utils/aiTemplates";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import type { Reference } from "../../types/cv/cv";

import {
  addReference,
  editReference,
  deleteReferenceById,
} from "../../features/references/referencesSlice";

import { useTimedLoader } from "../../hooks/useTimedLoader";

import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { generateCV } from "../../features/auth/authSlice";

type FormFields = z.infer<typeof referencesSchema>;
type AIReferencesData = {
  references: {
    name: string;
    position: string;
    email: string;
    phone: string;
  }[];
} | null;

interface Props {
  editingReference?: Reference;
  editingIndex?: number | null;
  onDone?: () => void;
}

const ReferencesFormDetails = ({ editingReference, editingIndex, onDone }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(3000);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // --- AI States ---
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<AIReferencesData>(null);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("references");

  const [isAILoading, setAILoading] = useState(false);

  const methods = useForm<FormFields>({
    resolver: zodResolver(referencesSchema),
    defaultValues: {
      references: [{ name: "", position: "", email: "", phone: "" }],
    },
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "references" });

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

  /* --------------------------------------------------------
      FORM SUBMIT HANDLER
  -------------------------------------------------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      const payload = {
        references: data.references.map((ref) => ({
          ...ref,
          full_name: [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" "),
          email: user.email,
        })),
      };

      try {
        let message = "";

        if (editingReference && editingIndex !== null) {
          await dispatch(editReference({ id: editingReference.id, data: payload })).unwrap();
          message = "✅ Reference updated successfully.";
        } else {
          await dispatch(addReference(payload)).unwrap();
          message = "✅ Reference added successfully.";
        }

        reset({ references: [{ name: "", position: "", email: "", phone: "" }] });
        setSuccessMessage(message);
        onDone?.();
      } catch (error) {
        console.error("Error submitting reference:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  /* --------------------------------------------------------
      REMOVE HANDLER
  -------------------------------------------------------- */
  const handleRemove = async (index: number, refId?: number) => {
    remove(index);
    if (refId) {
      try {
        await dispatch(deleteReferenceById(refId)).unwrap();
      } catch (err) {
        console.error("Failed to delete reference:", err);
      }
    }
  };

  /* --------------------------------------------------------
      AI HANDLERS
  -------------------------------------------------------- */
  const handleGenerateReferencesFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      const prompt = buildAIPromptDynamic("references", { instruction_text: instructionText });

      // Call backend AI API
      const resultAction = await dispatch(
        generateCV({
          section: "references",
          userData: { instruction_text: prompt },
        })
      ).unwrap();

      const parsedData = typeof resultAction === "string" ? JSON.parse(resultAction) : resultAction;

      // Ensure array exists
      const references = Array.isArray(parsedData.references)
        ? parsedData.references
        : [];

      setAIData({ references });
      setAIModalOpen(false);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Error generating AI references:", err);
    } finally {
      setAILoading(false);
    }
  };


  const handleAcceptReferencesAI = () => {
    if (!aiData?.references || !Array.isArray(aiData.references)) return;

    // Populate form with AI-generated references
    reset({ references: aiData.references });

    setSuccessMessage("✅ AI-generated references populated. Review before submitting.");
    setPreviewOpen(false);
    setAIData(null);
  };

  /* --------------------------------------------------------
      RENDER
  -------------------------------------------------------- */
  return (
    <FormProvider {...methods}>
      <section className="w-full mx-auto p-6 bg-whiteBg border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {editingReference ? "Edit Reference" : "Add Reference Details"}
        </h2>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Add at least one reference — for example, previous managers, team leads, or colleagues. Include their position, email, and phone number. Required fields are marked with *.
        </p>

        {/* AI Button */}
        {!editingReference && (
          <div className="flex justify-center mb-4">
            <Button
              type="button"
              label="✨ Autofill with AI"
              onClick={() => setAIModalOpen(true)}
              className="bg-primary text-white hover:bg-primary/90"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 space-y-4 relative">
              <InputField
                type="text"
                label="Referee Name *"
                placeholder="e.g., John Doe"
                name={`references.${index}.name`}
                register={register(`references.${index}.name` as const)}
                error={errors.references?.[index]?.name?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">Tip: Full name of your reference.</p>

              <InputField
                type="text"
                label="Position *"
                placeholder="e.g., Manager, Team Lead"
                name={`references.${index}.position`}
                register={register(`references.${index}.position` as const)}
                error={errors.references?.[index]?.position?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">Tip: Job title or position of your reference.</p>

              <InputField
                type="email"
                label="Email *"
                placeholder="e.g., example@gmail.com"
                name={`references.${index}.email`}
                register={register(`references.${index}.email` as const)}
                error={errors.references?.[index]?.email?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">Tip: Professional email address.</p>

              <InputField
                type="text"
                label="Phone Number *"
                placeholder="e.g., +255 123 456 789"
                name={`references.${index}.phone`}
                register={register(`references.${index}.phone` as const)}
                error={errors.references?.[index]?.phone?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">Tip: Contact number including country code.</p>

              {fields.length > 1 && !editingReference && (
                <Button
                  type="button"
                  label="Remove"
                  onClick={() => handleRemove(index, (field as any).id)}
                  disabled={loading}
                  className="bg-red-500 text-white hover:bg-red-600 absolute bottom-2 right-2"
                />
              )}
            </div>
          ))}

          <div className="flex gap-4 flex-wrap mx-4">
            {!editingReference && (
              <Button
                type="button"
                label="+ Add Reference"
                onClick={() => append({ name: "", position: "", email: "", phone: "" })}
                disabled={loading}
                className="text-white"
              />
            )}
            <Button
              type="submit"
              label={editingReference ? "Update" : "Submit"}
              disabled={loading}
              onClick={() => { }}
              className="text-white"
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

        {/* --- AI Modals --- */}
        <AIInputModal
          isOpen={isAIModalOpen}
          onClose={() => setAIModalOpen(false)}
          onSubmit={handleGenerateReferencesFromAI}
          loading={isAILoading}
          defaultText={aiTemplates[currentSection]} // <-- template for that section
          title={`Edit ${currentSection.replace("_", " ")}`}
          description="You can edit this text. AI will extract the info and fill the form."
          placeholder="Example: Add professional references for my CV. Include full name, position, email, and phone number. I want previous managers, team leads, or colleagues as references."
          generateLabel="Generate References"
          cancelLabel="Cancel"
        />

        <AIPreviewModal
          isOpen={isPreviewOpen}
          data={aiData}
          onClose={() => setPreviewOpen(false)}
          onAccept={handleAcceptReferencesAI}
          title="Review AI-Generated References"
          description="Confirm the AI-generated references before populating the form."
          acceptLabel="Accept & Autofill"
          discardLabel="Discard"
        />
      </section>
    </FormProvider>
  );
};

export default ReferencesFormDetails;
