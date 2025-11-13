/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CVCard } from "../../utils/CVCard";
import { FaTrash, FaTimes } from "react-icons/fa";
import type { User, Education } from "../../types/cv/cv";
import EducationFormDetails from "../forms/EducationFormDetails";
import Loader from "../common/Loader";
import {
  addEducation,
  editEducation,
  removeEducation,
} from "../../features/educations/educationsSlice";
import type { RootState, AppDispatch } from "../../store/store";

interface Props {
  cv: User;
  refetchCV?: () => Promise<void>; // optional safe refresh
}

const EducationSection = ({ cv, refetchCV }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { educations: reduxEducations, loading } = useSelector(
    (state: RootState) => state.educations
  );

  // Local source of truth
  const [localEducations, setLocalEducations] = useState<Education[]>(
    reduxEducations.length ? reduxEducations : cv.educations || []
  );

  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    setLoadingDelete(id);
    try {
      await dispatch(removeEducation(id)).unwrap();
      setLocalEducations((prev) => prev.filter((edu) => edu.id !== id));
      if (refetchCV) await refetchCV(); // ✅ optional refresh
    } catch (error) {
      console.error("Failed to delete education:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleDone = async (updatedEducation?: Education) => {
    if (!updatedEducation) {
      setEditingEducation(null);
      setShowModal(false);
      return;
    }

    try {
      if (updatedEducation.id) {
        // Update existing education
        await dispatch(
          editEducation({ id: updatedEducation.id, data: updatedEducation })
        ).unwrap();

        setLocalEducations((prev) =>
          prev.map((edu) =>
            edu.id === updatedEducation.id ? updatedEducation : edu
          )
        );
      } else {
        // Add new education
        const newEdu = await dispatch(addEducation(updatedEducation)).unwrap();
        setLocalEducations((prev) => [...prev, newEdu]);
      }

      if (refetchCV) await refetchCV(); // ✅ optional refresh
    } catch (err) {
      console.error("Failed to save education:", err);
    }

    setEditingEducation(null);
    setShowModal(false);
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
        {loading ? (
          <Loader loading={loading} message="Loading education..." />
        ) : localEducations.length === 0 ? (
          <p className="text-gray-400 italic font-sans">
            No education details added yet
          </p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {localEducations.map((education) => (
              <div
                key={`edu-${education.id ?? crypto.randomUUID()}`} // ✅ unique key
                className="relative rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:bg-muted transition-all duration-300"
              >
                {/* Edit/Delete buttons */}
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <span
                    className="text-primary font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setEditingEducation(education);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-primary cursor-pointer"
                    onClick={() => handleDelete(education.id)}
                  >
                    {loadingDelete === education.id ? "⏳" : <FaTrash />}
                  </span>
                </div>

                {/* Education Info */}
                <h4 className="font-semibold text-gray-800 dark:text-white mt-4">
                  {education.degree}
                </h4>
                <p className="text-gray-700 dark:text-gray-100">
                  {education.institution} – {education.location}
                </p>
                {education.grade && (
                  <p className="text-sm italic mt-1 text-gray-600 dark:text-gray-200">
                    Grade: {education.grade}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full">
                    Start: {education.start_date}
                  </span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded-full">
                    End: {education.end_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-subheading hover:text-primary font-bold text-lg"
              onClick={() => {
                setShowModal(false);
                setEditingEducation(null);
              }}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold text-text mb-4 text-center">
              {editingEducation ? "Edit Education" : "Add Education"}
            </h2>

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
