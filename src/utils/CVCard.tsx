import React from "react";

interface CVData {
  title: string;
  children: React.ReactNode;
  onEditClick?: () => void;
}

export const CVCard: React.FC<CVData> = ({ title, children }) => {
  return (
    <div className="relative bg-whiteBg rounded-lg p-4 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="mb-3 border-b border-red-500 pb-1">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
};
