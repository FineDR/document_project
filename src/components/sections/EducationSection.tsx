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

  // Delete education by ID
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

  // Called ONLY after successful submit in EducationFormDetails
// Called ONLY after successful submit in EducationFormDetails
const handleDone = (updatedEducation?: Education) => {
  if (!updatedEducation || !updatedEducation.id) {
    // Don’t add/update if data is invalid or missing id
    setShowModal(false);
    setEditingEducation(null);
    return;
  }

  setEducations((prev) => {
    const exists = prev.find((edu) => edu.id === updatedEducation.id);
    if (exists) {
      // Update existing
      return prev.map((edu) =>
        edu.id === updatedEducation.id ? updatedEducation : edu
      );
    } else {
      // Add new entry (only if not empty)
      return [...prev, updatedEducation];
    }
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
          <div className="space-y-4">
            {educations.map((education, index) => (
              <div
                key={education.id || index}
                className="relative transition-all duration-300 ease-in-out bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md group"
              >
                {/* Top-right buttons: Edit & Delete */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => {
                      setEditingEducation(education);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDelete(education.id)}
                    disabled={loadingDelete === education.id}
                  >
                    {loadingDelete === education.id ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <FaTrash size={18} />
                    )}
                  </button>
                </div>

                <br />
                <hr />

                {/* Education Details */}
                <h4 className="font-semibold text-gray-800 mt-4">{education.degree}</h4>
                <p className="text-gray-700">
                  {education.institution} – {education.location}
                </p>
                {education.grade && (
                  <p className="text-sm italic mt-1">Grade: {education.grade}</p>
                )}

                {/* Dates */}
                <div className="flex flex-col sm:w-1/5 md:w-1/2 sm:gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Start: {education.start_date}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1 sm:mt-0">
                    End: {education.end_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 top-9 absolute">
            <p className="text-gray-500 italic">No education details available.</p>
          </div>
        )}
      </CVCard>

      {/* Modal for adding/editing education */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false);
                setEditingEducation(null);
              }}
            >
              ✕
            </button>

            <EducationFormDetails
              editingEducation={editingEducation || undefined}
              onDone={handleDone} // ONLY updates after submit
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EducationSection;
