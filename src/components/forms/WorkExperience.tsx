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

type FormFields = z.infer<typeof workExperiencesSchema>;

interface Props {
  editingExperience?: WorkExperience;
  onDone?: (updatedExperience: WorkExperience) => void;
}

const WorkExperienceForm: React.FC<Props> = ({ editingExperience, onDone }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(1200); // minimum loader time
  const [successMessage, setSuccessMessage] = useState("");
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

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      try {
        const exp = data.experiences[0];

        const payload = {
          job_title: exp.job_title,
          company: exp.company,
          location: exp.location || "",
          start_date: exp.start_date || "",
          end_date: exp.end_date || "",
          responsibilities: exp.responsibilities.map((r) => ({ value: r.value })),
        };

        let updatedExp: WorkExperience | undefined;
        const message = editingExperience
          ? "✅ Work experience updated successfully."
          : "✅ Work experience saved successfully.";

        if (editingExperience?.id) {
          updatedExp = await dispatch(updateWorkExperienceById({ id: editingExperience.id, data: payload })).unwrap();
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
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default WorkExperienceForm;
