/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [references, setReferences] = useState<Reference[]>(cv.references || []);
  const [showModal, setShowModal] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
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

  const handleEditClick = (reference: Reference) => {
    setEditingReference(reference);
    setShowModal(true);
  };

  const handleDone = (updatedReference?: Reference) => {
    if (!updatedReference || !updatedReference.id) {
      setEditingReference(null);
      setShowModal(false);
      return;
    }

    const exists = references.find((r) => r.id === updatedReference.id);
    setReferences((prev) =>
      exists
        ? prev.map((r) => (r.id === updatedReference.id ? updatedReference : r))
        : [...prev, updatedReference]
    );

    setEditingReference(null);
    setShowModal(false);
  };

  return (
    <>
      <CVCard title="References">
        {references.length === 0 ? (
          <p className="text-gray-400 italic font-sans">No references added yet</p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {references.map((reference, index) => (
              <div
                key={reference.id || index}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                {/* Top-right actions */}
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <span
                    className="text-redMain font-medium cursor-pointer hover:underline"
                    onClick={() => handleEditClick(reference)}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-redMain cursor-pointer"
                    onClick={() => handleDelete(reference.id)}
                  >
                    {loadingDelete === reference.id ? "⏳" : <FaTrash />}
                  </span>
                </div>

                {/* Reference Details */}
                <h4 className="font-semibold text-gray-800 dark:text-white">{reference.name}</h4>
                {reference.position && (
                  <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {reference.position}
                  </span>
                )}
                <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-white">
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
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal for editing reference */}
      {showModal && editingReference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer font-bold text-lg"
              onClick={() => {
                setShowModal(false);
                setEditingReference(null);
              }}
            >
              ✕
            </span>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Reference
            </h2>

            <ReferencesFormDetails
              editingReference={editingReference}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReferencesSection;
