// src/components/modal/AIInputModal.tsx
import React, { useState, useEffect } from "react";
import Button from "../formElements/Button";

interface AIInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  loading: boolean;

  title?: string;
  description?: string;
  placeholder?: string;
  generateLabel?: string;
  cancelLabel?: string;
  defaultText?: string; // NEW: pre-filled text for user
}

export const AIInputModal: React.FC<AIInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  title = "Generate with AI",
  description = "Edit or paste your text below. The AI will extract your details and fill the form.",
  placeholder = "Write something here...",
  generateLabel = "Generate",
  cancelLabel = "Cancel",
  defaultText = "",
}) => {
  const [inputText, setInputText] = useState(defaultText);

  // Reset input text when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputText(defaultText);
    }
  }, [isOpen, defaultText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background text-text p-6 rounded-lg shadow-xl w-full max-w-lg m-4 border border-gray-300 dark:border-gray-700">
        
        <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
        <p className="text-sm text-text mb-4 opacity-80">{description}</p>

        <textarea
          className="
            w-full h-48 p-3 rounded-md resize-none
            bg-background text-text
            border border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-redMain
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          "
          placeholder={placeholder}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            label={cancelLabel}
            onClick={onClose}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          />

          <Button
            type="button"
            label={loading ? "Generating..." : generateLabel}
            onClick={() => onSubmit(inputText)}
            disabled={loading || !inputText.trim()}
            className="bg-redMain hover:opacity-90 text-white"
          />
        </div>
      </div>
    </div>
  );
};
