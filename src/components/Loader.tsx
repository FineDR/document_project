// src/components/Loader.tsx
import React from "react";
import { ClipLoader } from "react-spinners";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-text">
      <ClipLoader color="var(--red-main)" size={60} />
      <p className="mt-4 text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loader;
