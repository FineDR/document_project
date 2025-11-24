/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../formElements/Button";
import ExperienceInput from "./subform/ExperienceInput";
import { workExperiencesSchema } from "../forms/cvValidationSchema";
import type { z } from "zod";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addWorkExperience, updateWorkExperienceById } from "../../features/experiences/workExperiencesSlice";
import type { WorkExperience } from "../../types/cv/cv";

import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { generateCV } from "../../features/auth/authSlice";
import { aiTemplates } from "../../utils/aiTemplates";
// Type for form fields
type FormFields = z.infer<typeof workExperiencesSchema>;

interface Props {
  editingExperience?: WorkExperience;
  onDone?: (updatedExperience: WorkExperience) => void;
}

const WorkExperienceForm: React.FC<Props> = ({ editingExperience, onDone }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(1200);

  const [successMessage, setSuccessMessage] = useState("");
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";

  // --- AI States ---
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [aiPreviewData, setAIPreviewData] = useState<any>(null);
  const [isAILoading, setAILoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("work_experience");
  const handleOnclick = () => setActive(!active);

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(workExperiencesSchema),
    defaultValues: {
      experiences: [
        {
          job_title: "",
          company: "",
          location: "",
          start_date: "",
          end_date: "",
          responsibilities: [{ value: "" }],
        },
      ],
    },
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experiences",
  });

  // Populate form if editing
  useEffect(() => {
    if (editingExperience) {
      setValue("experiences", [
        {
          job_title: editingExperience.job_title,
          company: editingExperience.company,
          location: editingExperience.location,
          start_date: editingExperience.start_date,
          end_date: editingExperience.end_date,
          responsibilities: editingExperience.responsibilities.map(r => ({ value: r.value })),
        },
      ]);
    }
  }, [editingExperience, setValue]);

  // Auto-clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return null;

  // --- AI Handlers ---
  const handleGenerateFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      const aiResult = await dispatch(
        generateCV({
          section: "work_experience",
          userData: { instruction_text: instructionText }
        })
      ).unwrap();

      // Keep raw data for preview modal
      const parsedData = typeof aiResult === "string" ? JSON.parse(aiResult) : aiResult;

      setAIPreviewData(parsedData);   // show exactly what AI returned
      setPreviewModalOpen(true);
      setAIModalOpen(false);

    } catch (error) {
      console.error("Error generating AI work experience:", error);
    } finally {
      setAILoading(false);
    }
  };

  const handleAcceptAI = () => {
    if (!aiPreviewData) return;

    // Normalize AI data into experiences array
    const experiences: any[] = Array.isArray(aiPreviewData.experiences)
      ? aiPreviewData.experiences
      : [aiPreviewData]; // wrap single object into array

    // Clear current form
    reset({ experiences: [] });

    // Append each AI-extracted experience
    experiences.forEach((exp: any) => {
      appendExperience({
        job_title: exp.job_title ?? "",
        company: exp.company ?? "",
        location: exp.location ?? "",
        start_date: exp.start_date ?? "",
        end_date: exp.end_date ?? "",
        responsibilities: Array.isArray(exp.responsibilities)
          ? exp.responsibilities.map((r: any) => ({ value: r.value ?? r ?? "" }))
          : [{ value: exp.responsibilities ?? "" }],
      });
    });

    setSuccessMessage(
      `✅ ${experiences.length} AI-generated work experience(s) added. You can review before submission.`
    );

    setPreviewModalOpen(false);
    setAIPreviewData(null);
  };

  // --- Form Submit ---
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      try {
        const payload = data.experiences.map(exp => ({
          job_title: exp.job_title,
          company: exp.company,
          location: exp.location || "",
          start_date: exp.start_date || "",
          end_date: exp.end_date || "",
          responsibilities: exp.responsibilities.map(r => ({ value: r.value })),
        }));

        let updatedExp: WorkExperience | undefined;
        const message = editingExperience
          ? "✅ Work experience updated successfully."
          : "✅ Work experience saved successfully.";

        if (editingExperience?.id) {
          updatedExp = await dispatch(updateWorkExperienceById({ id: editingExperience.id, data: payload[0] })).unwrap();
        } else {
          updatedExp = await dispatch(addWorkExperience(payload)).unwrap();
        }

        reset({
          experiences: [
            {
              job_title: "",
              company: "",
              location: "",
              start_date: "",
              end_date: "",
              responsibilities: [{ value: "" }],
            },
          ],
        });

        setSuccessMessage(message);
        onDone?.(updatedExp);
      } catch (error) {
        console.error("Error submitting work experience:", error);
      }
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-whiteBg">
      <h2 className="text-center text-2xl font-semibold mb-6 mt-4">
        {editingExperience ? "Edit Work Experience" : "Add Work Experience"}
      </h2>

      <Button
        type="button"
        label="✨ AutoFill With AI"
        onClick={() => setAIModalOpen(true)}
        className="mb-4 mx-auto block text-white"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 m-8">
        {experienceFields.map((exp, index) => (
          <ExperienceInput
            key={exp.id}
            expIndex={index}
            control={control}
            register={register}
            errors={errors}
            removeExperience={removeExperience}
            disabled={loading}
          />
        ))}

        {!editingExperience && (
          <Button
            type="button"
            onClick={() =>
              appendExperience({
                job_title: "",
                company: "",
                location: "",
                start_date: "",
                end_date: "",
                responsibilities: [{ value: "" }],
              })
            }
            label="+ Add Work Experience"
            disabled={loading}
            className="mx-8"
          />
        )}

        <Button
          type="submit"
          label={editingExperience ? "Update" : "Submit"}
          onClick={handleOnclick}
          className={`${active ? hoverStyle : ""}`}
          disabled={loading}
        />

        <Loader loading={loading} message={editingExperience ? "Updating experience..." : "Saving experience..."} />
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
        onSubmit={handleGenerateFromAI}
        loading={isAILoading}
        defaultText={aiTemplates[currentSection]} // <-- template for that section
        title={`Edit ${currentSection.replace("_", " ")}`}
        description="You can edit this text. AI will extract the info and fill the form."
        placeholder="Worked as Software Engineer at XYZ Company from Jan 2021 to Dec 2022..."
        generateLabel="Generate"
        cancelLabel="Cancel"
      />

      <AIPreviewModal
        isOpen={isPreviewModalOpen}
        data={aiPreviewData}
        onClose={() => setPreviewModalOpen(false)}
        onAccept={handleAcceptAI}
        title="Review Extracted Work Experience"
        description="Confirm that the AI-extracted information is correct before filling the form."
        acceptLabel="Accept & Autofill"
        discardLabel="Discard"
      />
    </div>
  );
};

export default WorkExperienceForm;
