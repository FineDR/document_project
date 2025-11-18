/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useFieldArray, type UseFormRegister, type Control, type FieldErrors } from "react-hook-form";
import { FaX } from "react-icons/fa6";
import InputField from "../../formElements/InputField";

interface Responsibility {
  value: string;
}

interface Experience {
  job_title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  responsibilities: Responsibility[];
}

interface FormValues {
  experiences: Experience[];
}

interface ExperienceInputProps {
  expIndex: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  removeExperience: (index: number) => void;
  disabled?: boolean;
}

const ExperienceInput: React.FC<ExperienceInputProps> = ({
  expIndex,
  control,
  register,
  errors,
  removeExperience,
  disabled = false,
}) => {
  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control,
    name: `experiences.${expIndex}.responsibilities` as const,
  });

  const experienceErrors = errors.experiences?.[expIndex] as any;

  return (
    <div className="p-4 mb-6 space-y-5">
      <h3 className="font-semibold text-lg sm:text-xl mb-4">
        Work Experience #{expIndex + 1}
      </h3>

      {/* Job Title */}
      <InputField
        name={`experiences.${expIndex}.job_title`}
        type="text"
        placeholder="Frontend Developer"
        register={register(`experiences.${expIndex}.job_title`)}
        error={experienceErrors?.job_title?.message}
        disabled={disabled}
        required={true}
      />
      <p className="text-gray-400 text-xs italic mt-1">
        Enter your role, e.g., Frontend Developer or Project Manager
      </p>

      {/* Company */}
      <InputField
        name={`experiences.${expIndex}.company`}
        type="text"
        placeholder="Company name"
        register={register(`experiences.${expIndex}.company`)}
        error={experienceErrors?.company?.message}
        disabled={disabled}
        required={true}
      />
      <p className="text-gray-400 text-xs italic mt-1">
        The name of the organization you worked for
      </p>

      {/* Location */}
      <InputField
        name={`experiences.${expIndex}.location`}
        type="text"
        placeholder="City, state, or Remote"
        register={register(`experiences.${expIndex}.location`)}
        error={experienceErrors?.location?.message}
        disabled={disabled}
        required={false}
      />
      <p className="text-gray-400 text-xs italic mt-1">
        City, state, or “Remote”
      </p>

      {/* Start Date */}
      <InputField
        name={`experiences.${expIndex}.start_date`}
        type="date"
        register={register(`experiences.${expIndex}.start_date`)}
        error={experienceErrors?.start_date?.message}
        disabled={disabled}
        required={true}
      />
      <p className="text-gray-400 text-xs italic mt-1">
        Select the month and year you started
      </p>

      {/* End Date */}
      <InputField
        name={`experiences.${expIndex}.end_date`}
        type="date"
        register={register(`experiences.${expIndex}.end_date`)}
        error={experienceErrors?.end_date?.message}
        disabled={disabled}
        required={false}
      />
      <p className="text-gray-400 text-xs italic mt-1">
        Select the month and year you ended or leave empty if current
      </p>

      {/* Responsibilities */}
      <div className="space-y-3">
        {responsibilityFields.map((resp, respIndex) => (
          <div key={resp.id} className="relative">
            <InputField
              name={`experiences.${expIndex}.responsibilities.${respIndex}.value`}
              type="text"
              placeholder="Describe responsibility"
              register={register(`experiences.${expIndex}.responsibilities.${respIndex}.value`)}
              error={experienceErrors?.responsibilities?.[respIndex]?.value?.message}
              disabled={disabled}
              required={true}
            />
            <p className="text-gray-400 text-xs italic mt-1">
              Add a key responsibility for this position
            </p>
            <button
              type="button"
              onClick={() => removeResponsibility(respIndex)}
              disabled={disabled}
              className="absolute top-1/2 -translate-y-1/2 right-2 text-red-600 hover:text-red-800"
              title="Remove responsibility"
            >
              <FaX />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendResponsibility({ value: "" })}
          className="text-green-600 hover:underline disabled:opacity-50"
          disabled={disabled}
        >
          + Add Responsibility
        </button>
      </div>

      {/* Remove Experience */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => removeExperience(expIndex)}
          disabled={disabled}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Remove Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceInput;
