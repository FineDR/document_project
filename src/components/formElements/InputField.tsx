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
  helperText?: string; // ✅ new prop
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
}) => {
  if (!visible) return null;

  return (
    <div className="relative mb-6 w-full">
      {/* Input field */}
      <input
        id={name}
        type={type}
        placeholder=" "
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        {...register}
        className={`peer block w-full appearance-none rounded-md border border-gray-300 px-3 pt-5 pb-2 text-base text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-whiteBg"}`}
      />

      {/* Floating label */}
      <label
        htmlFor={name}
        className={`absolute left-3 top-0 -translate-y-1/2 bg-whiteBg px-1 text-sm text-gray-500 transition-all duration-200
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-blue-600
          pointer-events-none`}
      >
        {label || placeholder}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Helper text */}
      {!error && helperText && (
        <p className="mt-1 text-sm text-center text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
