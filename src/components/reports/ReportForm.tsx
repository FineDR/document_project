import React from "react";

interface ReportFormProps {
  content?: { label: string; value: string }[];
  onContentChange?: (newContent: { label: string; value: string }[]) => void;
  onLogoChange?: (file: File | null) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ content = [], onContentChange, onLogoChange }) => {
  const handleChange = (index: number, value: string) => {
    const updated = [...content];
    updated[index].value = value;
    onContentChange?.(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoChange?.(e.target.files[0]);
    }
  };

  return (
    <div className="m-5 p-5 flex flex-col gap-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Cover Page</h2>
      {content.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <label className="font-medium mb-1">{item.label}</label>
          <input
            type="text"
            value={item.value}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="p-2 border rounded-md bg-gray-50 text-gray-700"
          />
        </div>
      ))}

      <div className="flex flex-col gap-2 mt-4">
        <label className="font-medium mb-1">Upload Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} className="p-2 border rounded-md" />
      </div>
    </div>
  );
};

export default ReportForm;
