import React, { useState, useEffect } from "react";
import Button from "../formElements/Button";
import InputField from "../formElements/InputField"; // controlled input
import type { UseFormRegisterReturn } from "react-hook-form";

interface AIPreviewModalProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
  onAccept: (data: any) => void;
  register?: (name: string) => UseFormRegisterReturn; // optional
  title?: string;
  description?: string;
  acceptLabel?: string;
  discardLabel?: string;
}

export const AIPreviewModal: React.FC<AIPreviewModalProps> = ({
  isOpen,
  data,
  onClose,
  onAccept,
  register,
  title = "AI Extraction Preview",
  description = "Review and edit the extracted data below before accepting.",
  acceptLabel = "Accept & Fill",
  discardLabel = "Discard",
}) => {
  const [editableData, setEditableData] = useState<any>(data);

  // Sync when modal opens
  useEffect(() => {
    if (isOpen) setEditableData(data);
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  // Update nested value in editableData
  const handleChange = (path: string[], value: string) => {
    setEditableData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) current[key] = {};
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  // Recursive render
  const renderEditable = (value: any, path: string[] = []): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <div className="ml-2 space-y-2">
          {value.map((item, i) => (
            <div key={i} className="border p-2 rounded">
              {renderEditable(item, [...path, String(i)])}
            </div>
          ))}
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <div className="ml-2 space-y-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <InputField
                name={path.concat(k).join("_")}
                type="text"
                 value={typeof v === "string" ? v : (v as any)?.value ?? ""}

                onChange={(val) => handleChange([...path, k], val)}
                placeholder={k.replace(/_/g, " ")}
                register={register ? register(path.concat(k).join("_")) : undefined}
                label={k.replace(/_/g, " ")}
              />
              {typeof v === "object" && v !== null && renderEditable(v, [...path, k])}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <InputField
          name={path.join("_")}
          type="text"
          value={value ?? ""}
          onChange={(val) => handleChange(path, val)}
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background text-text p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col m-4 border border-gray-300 dark:border-gray-700 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
        <p className="text-sm text-text mb-4 opacity-80">{description}</p>

        <div className="flex-1 space-y-4">{renderEditable(editableData)}</div>

        <div className="flex justify-end gap-3 pt-2 mt-4">
          <Button
            type="button"
            label={discardLabel}
            onClick={onClose}
            className="bg-redMain hover:opacity-90 text-white"
          />
          <Button
            type="button"
            label={acceptLabel}
            onClick={() => onAccept(editableData)}
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>
      </div>
    </div>
  );
};
