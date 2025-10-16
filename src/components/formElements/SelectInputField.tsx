import type { UseFormRegister, FieldValues, FieldError, Path } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type SelectInputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>; // ensures type-safe nested keys
  register: UseFormRegister<T>;
  options: Option[];
  error?: FieldError;
  className?: string;
  disabled?: boolean; // added disabled prop
};

const SelectInputField = <T extends FieldValues>({
  label,
  name,
  register,
  options,
  error,
  className,
  disabled = false, // default to false
}: SelectInputFieldProps<T>) => {
  return (
    <div className={`flex flex-col mb-4 ${className ?? ""}`}>
      <label className="font-medium mb-1" htmlFor={name.toString()}>
        {label}
      </label>
      <select
        id={name.toString()}
        {...register(name)}
        className="border p-2 rounded bg-whiteBg"
        defaultValue=""
        disabled={disabled} // apply disabled
        style={{ backgroundColor: disabled ? "#f3f3f3" : "white" }} // visual cue
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
        <p className="text-red-600 text-sm mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectInputField;
