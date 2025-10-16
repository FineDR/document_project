/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../formElements/Button";
import ExperienceInput from "./subform/ExperienceInput";
import { workExperiencesSchema } from "../forms/cvValidationSchema";
import type { z } from "zod";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { submitWorkExperience, updateWorkExperience } from "../../api/workExperiences";
import type { WorkExperience } from "../../types/cv/cv";
import Loader from "../common/Loader"; // reusable loader
import { useTimedLoader } from "../../hooks/useTimedLoader"; // ensures minimum display time

type FormFields = z.infer<typeof workExperiencesSchema>;

interface Props {
  editingExperience?: WorkExperience;
  onDone?: (updatedExperience: WorkExperience) => void;
}

const WorkExperienceForm: React.FC<Props> = ({ editingExperience, onDone }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [successMessage, setSuccessMessage] = useState("");
  const { loading, withLoader } = useTimedLoader(1200); // minimum loader time
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";

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

  useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }
}, [successMessage]);

  if (!user) return null;

 const onSubmit: SubmitHandler<FormFields> = async (data) => {
  await withLoader(async () => {
    try {
      // Prepare message for the user
      const message = editingExperience
        ? "✅ Work experience updated successfully."
        : "✅ Work experience saved successfully.";

      // Take the first experience (editing one)
      const exp = data.experiences[0];

      // Build payload
      const payload = {
        job_title: exp.job_title,
        company: exp.company,
        location: exp.location || "",
        start_date: exp.start_date || "",
        end_date: exp.end_date || "",
        responsibilities: exp.responsibilities.map((r) => ({ value: r.value })),
      };

      // Call appropriate API
      const apiCall = editingExperience
        ? updateWorkExperience(editingExperience.id, payload as WorkExperience)
        : submitWorkExperience(payload as WorkExperience);

      const response = await apiCall;

      // Reset form to default/empty values
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

      // Show success notification card to the user
      setSuccessMessage(message);

      // Pass updated experience to parent or callback
      onDone?.(response);
    } catch (error) {
      console.error("Error submitting work experience:", error);
    }
  });
};

  return (
    <div className="p-4 border rounded-lg bg-whiteBg">
      <h2 className="text-center  text-2xl font-semibold mb-6 mt-4">
        {editingExperience ? "Edit Work Experience" : "Add Work Experience"}
      </h2>

      <div className="relative">
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
            />
          )}

          <Button
            type="submit"
            label={editingExperience ? "Update" : "Submit"}
            onClick={handleOnclick}
            className={`mx-4 ${active ? hoverStyle : ""}`}
            disabled={loading}
          />

          {/* Reusable loader */}
          <Loader loading={loading} message={editingExperience ? "Updating experience..." : "Saving experience..."} />
        </form>
      </div>
        {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}

    </div>
  );
};

export default WorkExperienceForm;
