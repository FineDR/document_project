import type { UseFormRegister, FieldValues, FieldError, Path } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type SelectInputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>; // type-safe nested keys
  register: UseFormRegister<T>;
  options: Option[];
  error?: FieldError;
  className?: string;
  disabled?: boolean; // optional disabled
};

const SelectInputField = <T extends FieldValues>({
  label,
  name,
  register,
  options,
  error,
  className,
  disabled = false,
}: SelectInputFieldProps<T>) => {
  return (
    <div className={`flex flex-col mb-4 w-full ${className ?? ""}`}>
      <label
        htmlFor={name.toString()}
        className="mb-1 text-sm font-medium text-subheading dark:text-subheading"
      >
        {label}
      </label>
      <select
        id={name.toString()}
        {...register(name)}
        disabled={disabled}
        className={`border rounded px-3 py-2 text-text dark:text-text bg-background dark:bg-background
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          ${error ? "border-redMain focus:ring-redMain" : "border-gray-300 dark:border-gray-600"}
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
          transition-colors duration-200
        `}
        defaultValue=""
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-redMain" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectInputField;
