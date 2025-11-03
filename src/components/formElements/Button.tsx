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
      className={`
        bg-redMain 
        text-white 
        hover:bg-redMain/90 
        disabled:opacity-60 
        disabled:cursor-not-allowed 
        rounded-md 
        py-2 
        px-4 
        font-button 
        transition-colors 
        duration-200
        ${className}
      `}
      aria-disabled={disabled}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;
