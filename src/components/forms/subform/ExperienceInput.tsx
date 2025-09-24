import { useFieldArray, type UseFormRegister, type Control, type FieldErrors } from "react-hook-form";
import InputField from "../../formElements/InputField";
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
  disabled?: boolean; // <-- New prop
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
    <div className=" p-8 mb-6 ">
      <h3 className="font-semibold mb-2">Work Experience #{expIndex + 1}</h3>

      <div className="grid grid-cols-1 gap-6 mb-4">
        <InputField
          type="text"
          label="Job Title *"
          placeholder="e.g., Software Engineer"
          name={`experiences.${expIndex}.job_title`}
          register={register(`experiences.${expIndex}.job_title`)}
          error={experienceErrors?.job_title?.message}
          disabled={disabled}
        />
        <InputField
          type="text"
          label="Company *"
          placeholder="e.g., Google, Microsoft"
          name={`experiences.${expIndex}.company`}
          register={register(`experiences.${expIndex}.company`)}
          error={experienceErrors?.company?.message}
          disabled={disabled}
        />
        <InputField
          type="text"
          label="Location *"
          placeholder="e.g., New York, Remote"
          name={`experiences.${expIndex}.location`}
          register={register(`experiences.${expIndex}.location`)}
          error={experienceErrors?.location?.message}
          disabled={disabled}
        />
        <InputField
          type="date"
          label="Start Date *"
          name={`experiences.${expIndex}.start_date`}
          placeholder="e.g., 2020-01-01"
          register={register(`experiences.${expIndex}.start_date`)}
          error={experienceErrors?.start_date?.message}
          disabled={disabled}
        />
        <InputField
          type="date"
          label="End Date *"
          name={`experiences.${expIndex}.end_date`}
          placeholder="End Date"
          register={register(`experiences.${expIndex}.end_date`)}
          error={experienceErrors?.end_date?.message}
          disabled={disabled}
        />
      </div>

      <div>
        <label className="font-semibold">Responsibilities</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {responsibilityFields.map((responsibility, respIndex) => (
            <div key={responsibility.id} className="items-center gap-2 w-full">
              <InputField
                type="text"
                placeholder="e.g., Developed user-friendly web applications using React and Node.js."
                name={`experiences.${expIndex}.responsibilities.${respIndex}.value`}
                register={register(
                  `experiences.${expIndex}.responsibilities.${respIndex}.value`
                )}
                error={
                  experienceErrors?.responsibilities?.[respIndex]?.value?.message
                }
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => removeResponsibility(respIndex)}
                className="text-red-500 hover:underline"
                disabled={disabled}
              >
                <FaX className="mb-12 text-sm"/>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => appendResponsibility({ value: "" })}
          className="mt-2 text-blue-600 hover:underline"
          disabled={disabled}
        >
          + Add Responsibility
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeExperience(expIndex)}
        className="mt-4 text-red-600 hover:underline"
        disabled={disabled}
      >
        Remove Experience
      </button>
    </div>
  );
};

export default ExperienceInput;
