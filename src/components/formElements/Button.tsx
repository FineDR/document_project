import React from "react";

export interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn bg-red-600 ${className}`}
      aria-disabled={disabled}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        color: "#fff",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,

      }}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;
