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
  visible?: boolean; // new prop to optionally hide/show the field
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
  visible = true, // default visible
}) => {
  if (!visible) return null; // hide if not visible

  return (
    <div className="input-group" style={{ marginBottom: "1rem" }}>
      {label && <label className="inline-block mb-1">{label}</label>}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...register}
        style={{
          padding: "0.5rem",
          width: "100%",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: disabled ? "#f3f3f3" : "white",
        }}
      />
      {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
    </div>
  );
};

export default InputField;
