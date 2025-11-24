/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, WorkExperience } from "../../types/cv/cv";
import WorkExperienceForm from "../forms/WorkExperience";
import {
  addWorkExperience,
  updateWorkExperienceById,
  deleteWorkExperienceById,
} from "../../features/experiences/workExperiencesSlice";
import type { AppDispatch } from "../../store/store";

interface Props {
  cv: User;
  refetchCV: () => Promise<void>;
}

const WorkExperienceSection = ({ cv,refetchCV }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    cv.work_experiences || []
  );
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      setLoadingDelete(id);
      await dispatch(deleteWorkExperienceById(id) as any).unwrap();
      await refetchCV();
      setWorkExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Failed to delete work experience:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

const handleDone = async (updatedExperience: WorkExperience) => {
  try {
    if (updatedExperience.id) {
      // Existing experience → update
      await dispatch(
        updateWorkExperienceById({ id: updatedExperience.id, data: updatedExperience }) as any
      ).unwrap();
    } else {
      // New experience → add
      await dispatch(addWorkExperience(updatedExperience) as any).unwrap();
    }

    // Refresh CV to reflect latest changes
    await refetchCV();
  } catch (error) {
    console.error("Failed to save work experience:", error);
  } finally {
    // Close modal and reset editing state
    setShowModal(false);
    setEditingExperience(null);
  }
};


  return (
    <>
     <CVCard title="Work Experience">
  {workExperiences.length > 0 ? (
    <div className="space-y-6 font-sans text-subHeadingGray">
      {workExperiences.map((exp) => (
        <div
          key={exp.id}
          className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
        >
          {/* Top-right buttons: Edit & Delete */}
          <div className="absolute top-4 right-4 flex gap-2 text-sm">
            <button
              className="text-redMain hover:underline"
              onClick={() => {
                setEditingExperience(exp);
                setShowModal(true);
              }}
            >
              Edit
            </button>
            <button
              className="text-gray-400 hover:text-redMain"
              onClick={() => handleDelete(exp.id!)}
              disabled={loadingDelete === exp.id}
            >
              {loadingDelete === exp.id ? "⏳" : <FaTrash size={14} />}
            </button>
          </div>

          {/* Job title */}
          {exp.job_title && (
            <h4 className="font-semibold text-base mb-1 text-subHeadingGray">
              {exp.job_title}
            </h4>
          )}

          {/* Company and location */}
          {(exp.company || exp.location) && (
            <p className="text-sm text-subHeadingGray mb-2">
              {exp.company}
              {exp.company && exp.location ? " – " : ""}
              {exp.location}
            </p>
          )}

          {/* Dates */}
          {(exp.start_date || exp.end_date) && (
            <div className="flex flex-wrap gap-2 mb-3 text-xs">
              {exp.start_date && (
                <span className="bg-blue-100 dark:bg-blue-900 dark:text-white text-blue-800 px-2 py-1 rounded-full">
                  Start: {exp.start_date}
                </span>
              )}
              <span className="bg-green-100 dark:bg-green-900 dark:text-white text-green-800 px-2 py-1 rounded-full">
                End: {exp.end_date || "Present"}
              </span>
            </div>
          )}

          {/* Responsibilities */}
          {exp.responsibilities && exp.responsibilities.length > 0 && (
            <ul className="list-none pl-0 space-y-2 sm:space-y-3 text-sm sm:text-base">
              {exp.responsibilities.map(
                (res) =>
                  res.value && (
                    <li
                      key={res.id}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                      <span>{res.value}</span>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400 italic font-sans">
      No work experience added yet
    </p>
  )}
</CVCard>


      {/* Modal for editing work experience */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300 border border-gray-200 dark:border-gray-700">

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-subheading hover:text-primary font-bold text-lg transition-colors duration-200"
              onClick={() => {
                setShowModal(false);
                setEditingExperience(null);
              }}
              aria-label="Close Modal"
            >
              ✕
            </button>

            {/* Form Content */}
            <div className="space-y-4">

              <WorkExperienceForm
                editingExperience={editingExperience || undefined}
                onDone={handleDone}
              />
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default WorkExperienceSection;
