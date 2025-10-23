/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Education } from "../../types/cv/cv";
import EducationFormDetails from "../forms/EducationFormDetails";
import { deleteEducation } from "../../api/submitEducation";

interface Props {
  cv: User;
}

const EducationSection = ({ cv }: Props) => {
  const [educations, setEducations] = useState<Education[]>(cv.educations || []);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setLoadingDelete(id);
      await deleteEducation(id);
      setEducations((prev) => prev.filter((edu) => edu.id !== id));
    } catch (error) {
      console.error("Failed to delete education:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleDone = (updatedEducation?: Education) => {
    if (!updatedEducation || !updatedEducation.id) {
      setShowModal(false);
      setEditingEducation(null);
      return;
    }

    setEducations((prev) => {
      const exists = prev.find((edu) => edu.id === updatedEducation.id);
      return exists
        ? prev.map((edu) => (edu.id === updatedEducation.id ? updatedEducation : edu))
        : [...prev, updatedEducation];
    });

    setShowModal(false);
    setEditingEducation(null);
  };

  return (
    <>
      <CVCard
        title="Education"
        onEditClick={() => {
          setEditingEducation(null);
          setShowModal(true);
        }}
      >
        {educations.length > 0 ? (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {educations.map((education, index) => (
              <div
                key={education.id || index}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                {/* Top-right buttons: Edit & Delete */}
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <button
                    className="text-redMain font-medium hover:underline"
                    onClick={() => {
                      setEditingEducation(education);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:text-redMain"
                    onClick={() => handleDelete(education.id)}
                    disabled={loadingDelete === education.id}
                  >
                    {loadingDelete === education.id ? "⏳" : <FaTrash />}
                  </button>
                </div>

                {/* Education Details */}
                <h4 className="font-semibold text-gray-800 mt-4 dark:text-white">{education.degree}</h4>
                <p className="text-gray-700 dark:text-gray-100">
                  {education.institution} – {education.location}
                </p>
                {education.grade && (
                  <p className="text-sm italic mt-1">Grade: {education.grade}</p>
                )}

                {/* Dates */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Start: {education.start_date}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    End: {education.end_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic font-sans text-center py-2">
            No education details available.
          </p>
        )}
      </CVCard>

      {/* Modal for adding/editing education */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              onClick={() => {
                setShowModal(false);
                setEditingEducation(null);
              }}
            >
              ✕
            </button>

            <EducationFormDetails
              editingEducation={editingEducation || undefined}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EducationSection;
