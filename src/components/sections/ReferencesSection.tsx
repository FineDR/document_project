// src/components/sections/ReferencesSection.tsx
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Reference } from "../../types/cv/cv";
import ReferencesFormDetails from "../forms/ReferencesFormDetails";
import { deleteReference } from "../../api/references";

interface Props {
  cv: User;
}

const ReferencesSection = ({ cv }: Props) => {
  const [references, setReferences] = useState<Reference[]>(
    cv.references || []
  );
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setLoadingDelete(id);
      await deleteReference(id);
      setReferences((prev) => prev.filter((ref) => ref.id !== id));
    } catch (error) {
      console.error("Failed to delete reference:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  return (
    <>
      <CVCard title="References">
        <div className="flex justify-end items-center mb-3">
          {/* <h4 className="font-semibold text-gray-800">References</h4> */}
          {references.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {references.length === 0 ? (
          <p className="text-gray-500 italic">No references added yet</p>
        ) : (
          <div className="space-y-4">
            {references.map((reference, index) => (
              <div
                key={reference.id || index}
                className="relative transition-all duration-300 ease-in-out bg-white rounded-lg border border-gray-200 p-4 group shadow-sm"
              >
                {/* Name */}
                <h4 className="font-semibold text-gray-800">
                  {reference.name}
                </h4>

                {/* Position as badge */}
                {reference.position && (
                  <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {reference.position}
                  </span>
                )}

                {/* Contact info */}
                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  {reference.email && (
                    <p>
                      <strong>Email:</strong> {reference.email}
                    </p>
                  )}
                  {reference.phone && (
                    <p>
                      <strong>Phone:</strong> {reference.phone}
                    </p>
                  )}
                </div>

                {/* Delete button (hover only) */}
                <button
                  className="absolute top-3 right-3 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition"
                  onClick={() => handleDelete(reference.id)}
                  disabled={loadingDelete === reference.id}
                >
                  {loadingDelete === reference.id ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <FaTrash size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal */}
      {showModal && references.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
           

            {references.map((reference, index) => (
              <ReferencesFormDetails
                key={reference.id || index}
                editingReference={reference}
                editingIndex={index}
                onDone={() => setShowModal(false)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ReferencesSection;
