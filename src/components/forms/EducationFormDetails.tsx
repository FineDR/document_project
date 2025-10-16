/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import { educationSchema } from "../forms/cvValidationSchema";
import { z } from "zod";
import { submitEducation, updateEducation } from "../../api/submitEducation";
import type { Education } from "../../types/cv/cv";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";

type FormFields = {
  education: z.infer<typeof educationSchema>[];
};

interface Props {
  editingEducation?: FormFields["education"][0] & { id?: number };
  onDone?: (updatedEducation?: Education) => void;
}

const EducationFormDetails = ({ editingEducation, onDone }: Props) => {
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const { withLoader } = useTimedLoader(3000);
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";

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

  useEffect(() => {
    if (editingEducation) replace([editingEducation]);
    else reset({ education: [{ degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" }] });
  }, [editingEducation, replace, reset]);

  const handleOnClick = () => setActive(!active);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      setLoading(true);
      setElapsedTime(0);
      const startTime = Date.now();
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        const payload = data.education[0];
        if (!payload.degree || !payload.institution || !payload.start_date) {
          console.error("Please fill all required fields!");
          return;
        }

        let updatedEdu: Education | undefined;
        let message = "";

        if (editingEducation?.id) {
          updatedEdu = await updateEducation(editingEducation.id, payload);
          message = "✅ Education updated successfully.";
        } else {
          const response = await submitEducation({ education: data.education });
          updatedEdu = response.data?.[0];
          message = "✅ Education submitted successfully.";
        }

        setSuccessMessage(message);
        reset({ education: [{ degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" }] });
        onDone?.(updatedEdu);
      } catch (error) {
        console.error("Error submitting education:", error);
      } finally {
        clearInterval(interval);
        setLoading(false);
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
            <p className="text-gray-500 text-xs">
              Enter the full name of your degree, diploma, or certification.
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
            <p className="text-gray-500 text-xs">
              Full name of the school, college, or university attended.
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
            <p className="text-gray-500 text-xs">
              City and country where the institution is located.
            </p>

            <InputField
              type="date"
              label="Start Date *"
              name={`education.${index}.start_date`}
              register={register(`education.${index}.start_date`)}
              error={errors.education?.[index]?.start_date?.message}
              disabled={loading}
            />
            <p className="text-gray-500 text-xs">
              The date you started this program.
            </p>

            <InputField
              type="date"
              label="End Date"
              name={`education.${index}.end_date`}
              register={register(`education.${index}.end_date`)}
              error={errors.education?.[index]?.end_date?.message}
              disabled={loading}
            />
            <p className="text-gray-500 text-xs">
              The date you completed this program (leave blank if ongoing).
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
            <p className="text-gray-500 text-xs">
              Enter your GPA, final grade, or any honors/awards received.
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
              onClick={() => append({ degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" })}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
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
    </section>
  );
};

export default EducationFormDetails;
