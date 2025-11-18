import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface InputFieldProps {
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  error?: string;
  label?: string;
  disabled?: boolean;
  visible?: boolean;
  autoFocus?: boolean;
  helperText?: string;
  value?: string; // controlled value
  onChange?: (val: string) => void; // callback to update parent
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  register,
  placeholder,
  required = false,
  error,
  label,
  disabled = false,
  visible = true,
  autoFocus = false,
  helperText,
  value,
  onChange,
}) => {
  if (!visible) return null;

  return (
    <div className="relative mb-6 w-full">
      <input
        id={name}
        type={type}
        placeholder=" "
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        {...register}
        className={`peer block w-full appearance-none rounded-md border px-3 pt-5 pb-2 text-base placeholder-transparent
    ${error ? "border-redMain focus:ring-redMain" : "border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"}
    ${disabled ? "bg-gray-100 cursor-not-allowed dark:bg-gray-700" : "bg-background dark:bg-background"}
    text-text dark:text-text
    focus:outline-none focus:ring-2 transition-colors duration-200
  `}
      />


      <label
        htmlFor={name}
        className={`absolute left-3 top-0 -translate-y-1/2 px-1 text-sm transition-all duration-200
          bg-background dark:bg-background
          text-subheading dark:text-subheading
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 
          peer-placeholder-shown:text-base
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm 
          peer-focus:text-redMain
          pointer-events-none
        `}
      >
        {label || placeholder}
        {required ? <span className="text-redMain">*</span> : null}

      </label>

      {error && <p className="mt-1 text-sm text-redMain">{error}</p>}

      {!error && helperText && (
        <p className="mt-1 text-sm text-text text-center dark:text-text">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
