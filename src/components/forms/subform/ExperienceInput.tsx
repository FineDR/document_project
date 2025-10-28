import {
  useFieldArray,
  type UseFormRegister,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { FaX } from "react-icons/fa6";

interface Responsibility {
  value: string;
}

interface Experience {
  job_title: string;
  company: string;
  location?: string;
  start_date?: string;
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

  const experienceErrors = errors.experiences?.[expIndex];

  return (
    <div className="p-6 mb-6 space-y-6">
      <h3 className="font-semibold text-lg sm:text-xl mb-4">
        Work Experience #{expIndex + 1}
      </h3>

      {/* Job Title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="sm:w-1/4 font-medium text-gray-700">Job Title *</label>
        <div className="sm:flex-1">
          <input
            type="text"
            placeholder="e.g., Software Engineer"
            {...register(`experiences.${expIndex}.job_title`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {experienceErrors?.job_title?.message && (
            <p className="text-red-500 text-sm mt-1">
              {experienceErrors?.job_title?.message}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            Enter your role, e.g., Frontend Developer or Project Manager
          </p>
        </div>
      </div>

      {/* Company */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="sm:w-1/4 font-medium text-gray-700">Company *</label>
        <div className="sm:flex-1">
          <input
            type="text"
            placeholder="e.g., Google, Microsoft"
            {...register(`experiences.${expIndex}.company`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {experienceErrors?.company?.message && (
            <p className="text-red-500 text-sm mt-1">
              {experienceErrors?.company?.message}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            The name of the organization you worked for
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="sm:w-1/4 font-medium text-gray-700">Location *</label>
        <div className="sm:flex-1">
          <input
            type="text"
            placeholder="e.g., New York, Remote"
            {...register(`experiences.${expIndex}.location`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {experienceErrors?.location?.message && (
            <p className="text-red-500 text-sm mt-1">
              {experienceErrors?.location?.message}
            </p>
          )}
          <p className="text-gray-500 text-sm">City, state, or “Remote”</p>
        </div>
      </div>

      {/* Start and End Dates */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="sm:w-1/4 font-medium text-gray-700">Start Date *</label>
        <div className="sm:flex-1">
          <input
            type="date"
            {...register(`experiences.${expIndex}.start_date`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {experienceErrors?.start_date?.message && (
            <p className="text-red-500 text-sm mt-1">
              {experienceErrors?.start_date?.message}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            Select the month and year you started
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="sm:w-1/4 font-medium text-gray-700">End Date *</label>
        <div className="sm:flex-1">
          <input
            type="date"
            {...register(`experiences.${expIndex}.end_date`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {experienceErrors?.end_date?.message && (
            <p className="text-red-500 text-sm mt-1">
              {experienceErrors?.end_date?.message}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            Select the month and year you ended or leave empty if current
          </p>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <label className="sm:w-1/4 font-medium text-gray-700 mt-2">
          Responsibilities
        </label>
        <div className="sm:flex-1 space-y-3">
          {responsibilityFields.map((responsibility, respIndex) => (
            <div key={responsibility.id} className="relative">
              <input
                type="text"
                placeholder="e.g., Designed UI, optimized APIs..."
                {...register(
                  `experiences.${expIndex}.responsibilities.${respIndex}.value`
                )}
                disabled={disabled}
                className="w-full border rounded-md p-2 pr-8 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
              />
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
            className="text-blue-600 hover:underline disabled:opacity-50"
            disabled={disabled}
          >
            + Add Responsibility
          </button>

          {experienceErrors?.responsibilities && (
            <p className="text-red-500 text-sm mt-1">
              {(experienceErrors?.responsibilities as any)?.message}
            </p>
          )}
        </div>
      </div>

      {/* Remove Experience Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => removeExperience(expIndex)}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
          disabled={disabled}
        >
          Remove Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceInput;
