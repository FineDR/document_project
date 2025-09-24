// components/Loader.tsx
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface LoaderProps {
  loading: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ loading, message }) => {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex flex-col justify-center items-center rounded-2xl z-50">
      <ClipLoader color="#0f62fe" size={40} />
      {message && <p className="mt-2 text-primary font-medium">{message}</p>}
    </div>
  );
};

export default Loader;
