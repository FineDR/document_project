/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { educationSchema } from "../forms/cvValidationSchema";
import { z } from "zod";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addEducation, editEducation } from "../../features/educations/educationsSlice";
import type { Education } from "../../types/cv/cv";

import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { generateCV } from "../../features/auth/authSlice";
import { aiTemplates } from "../../utils/aiTemplates";
type FormFields = {
  education: z.infer<typeof educationSchema>[];
};

interface Props {
  editingEducation?: FormFields["education"][0] & { id?: number };
  onDone?: (updatedEducation?: Education) => void;
}

const EducationFormDetails: React.FC<Props> = ({ editingEducation, onDone }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, withLoader } = useTimedLoader(3000);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";

  // --- AI States ---
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<Record<string, any> | null>(null);
  const [isAILoading, setAILoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("education");

  const { register, control, reset, handleSubmit, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(z.object({ education: educationSchema.array() })),
    defaultValues: {
      education: [
        { degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "education",
  });

  // Reset form for editing or new entry
  useEffect(() => {
    if (editingEducation) replace([editingEducation]);
    else reset({
      education: [{ degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" }],
    });
  }, [editingEducation, replace, reset]);

  const handleOnClick = () => setActive(!active);

  /* ---------------------- AI Handlers ---------------------- */
  const handleGenerateEducationFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      // Build dynamic AI prompt for the education section
      const prompt = buildAIPromptDynamic("education", { instruction_text: instructionText });

      // Dispatch the thunk with correct key: instruction_text
      const resultAction = await dispatch(
        generateCV({ section: "education", userData: { instruction_text: prompt } })
      );

      if (generateCV.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;

        // Extract array using backend's section format
        const educationArray =
          payload.educations && Array.isArray(payload.educations)
            ? payload.educations
            : [];

        setAIData(educationArray); // for preview modal
        setAIModalOpen(false);
        setPreviewOpen(true);
      } else {
        console.error("AI generation failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setAILoading(false);
    }
  };

  const handleAcceptEducationAI = () => {
    if (!aiData || !Array.isArray(aiData)) return;

    reset({ education: aiData });
    setSuccessMessage(
      "✅ Form populated with AI-generated education details. You can review before submission."
    );
    setPreviewOpen(false);
    setAIData(null);
  };

  /* ---------------------- Form Submit ---------------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      setElapsedTime(0);
      const startTime = Date.now();
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        const payload = data.education;
        let updatedEdu: Education | undefined;
        let message = "";

        if (editingEducation?.id) {
          updatedEdu = await dispatch(editEducation({ id: editingEducation.id, data: payload[0] })).unwrap();
          message = "✅ Education updated successfully.";
        } else {
          updatedEdu = await dispatch(addEducation({ education: payload })).unwrap();
          message = "✅ Education submitted successfully.";
        }

        reset({ education: [{ degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" }] });
        setSuccessMessage(message);
        onDone?.(updatedEdu);
      } catch (error) {
        console.error("Error submitting education:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  return (
    <section className="relative mx-auto mt-10 p-6 border bg-whiteBg rounded-lg w-full">
      <h2 className="text-center text-2xl font-semibold mb-6">
        {editingEducation ? "Edit Education" : "Add Education Details"}
      </h2>
      <p className="text-gray-600 text-sm mb-4 text-center">
        Fill in your education details carefully. Required fields are marked with *.
      </p>

      {/* AI Button */}
      {!editingEducation && (
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            label="✨ Autofill with AI"
            onClick={() => setAIModalOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 mb-4 space-y-2 rounded">
            <InputField
              type="text"
              label="Degree or Certification *"
              placeholder="e.g., Bachelor of Science in Computer Science"
              name={`education.${index}.degree`}
              register={register(`education.${index}.degree`)}
              error={errors.education?.[index]?.degree?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Enter the full name of your degree or certificate. Example: "Bachelor of Science in Computer Science".
            </p>

            <InputField
              type="text"
              label="Institution Name *"
              placeholder="e.g., University of Dodoma"
              name={`education.${index}.institution`}
              register={register(`education.${index}.institution`)}
              error={errors.education?.[index]?.institution?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              The name of the school, college, or university where you studied.
            </p>

            <InputField
              type="text"
              label="Location *"
              placeholder="e.g., Dodoma, Tanzania"
              name={`education.${index}.location`}
              register={register(`education.${index}.location`)}
              error={errors.education?.[index]?.location?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              City and country of the institution.
            </p>

            <InputField
              type="date"
              name={`education.${index}.start_date`}
              register={register(`education.${index}.start_date`)}
              error={errors.education?.[index]?.start_date?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              When you started the program.
            </p>

            <InputField
              type="date"
              name={`education.${index}.end_date`}
              register={register(`education.${index}.end_date`)}
              error={errors.education?.[index]?.end_date?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              When you completed or expect to complete the program. Leave empty if ongoing.
            </p>

            <InputField
              type="text"
              label="Grade or Honors"
              placeholder="e.g., Upper Second Class"
              name={`education.${index}.grade`}
              register={register(`education.${index}.grade`)}
              error={errors.education?.[index]?.grade?.message}
              disabled={loading}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Optional: Enter your grade, GPA, or honors if applicable.
            </p>

            {!editingEducation && fields.length > 1 && (
              <button
                type="button"
                className="text-red-500 text-sm underline"
                onClick={() => remove(index)}
                disabled={loading}
              >
                Remove this entry
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-3 justify-start">
          {!editingEducation && (
            <Button
              type="button"
              label="+ Add More"
              onClick={() =>
                append({ degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" })
              }
              disabled={loading}
              className="mx-4"
            />
          )}
          <Button
            type="submit"
            label={editingEducation ? "Update" : "Submit"}
            onClick={handleOnClick}
            disabled={loading}
            className={`${active ? hoverStyle : ""}`}
          />
        </div>

        <Loader
          loading={loading}
          message={loading ? `Saving your education details... (${elapsedTime}s elapsed)` : ""}
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
        onSubmit={handleGenerateEducationFromAI}
        loading={isAILoading}
        defaultText={aiTemplates[currentSection]} // <-- template for that section
        title={`Edit ${currentSection.replace("_", " ")}`}
        description="You can edit this text. AI will extract the info and fill the form."
        placeholder="Example: I graduated with BSc in Computer Science from University of Dodoma in 2022."
        generateLabel="Generate Education"
        cancelLabel="Cancel"
      />

      <AIPreviewModal
        isOpen={isPreviewOpen}
        data={aiData}
        onClose={() => setPreviewOpen(false)}
        onAccept={handleAcceptEducationAI}
        title="Review AI-Generated Education"
        description="Confirm the AI-generated education details before populating the form."
        acceptLabel="Accept & Autofill"
        discardLabel="Discard"
      />
    </section>
  );
};

export default EducationFormDetails;
