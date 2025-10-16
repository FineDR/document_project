/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, WorkExperience } from "../../types/cv/cv";
import WorkExperienceForm from "../forms/WorkExperience";
import { deleteWorkExperience } from "../../api/workExperiences";

interface Props {
  cv: User;
}

const WorkExperienceSection = ({ cv }: Props) => {
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
      await deleteWorkExperience(id);
      setWorkExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Failed to delete work experience:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleDone = (updatedExperience: WorkExperience) => {
    const exists = workExperiences.find(
      (exp) => exp.id === updatedExperience.id
    );
    if (exists) {
      setWorkExperiences((prev) =>
        prev.map((exp) =>
          exp.id === updatedExperience.id ? updatedExperience : exp
        )
      );
    } else {
      setWorkExperiences((prev) => [...prev, updatedExperience]);
    }
    setShowModal(false);
    setEditingExperience(null);
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
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setEditingExperience(exp);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:text-redMain"
                    onClick={() => handleDelete(exp.id)}
                    disabled={loadingDelete === exp.id}
                  >
                    {loadingDelete === exp.id ? "⏳" : <FaTrash size={14} />}
                  </button>
                </div>

                {/* Job title, company, location */}
                <h4 className="font-semibold text-base mb-1 text-subHeadingGray">
                  {exp.job_title}
                </h4>
                <p className="text-sm text-subHeadingGray mb-2">
                  {exp.company} – {exp.location}
                </p>

                {/* Dates */}
                <div className="flex flex-wrap gap-2 mb-3 text-xs">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Start: {exp.start_date}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    End: {exp.end_date || "Present"}
                  </span>
                </div>

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 pl-5 text-sm">
                    {exp.responsibilities.map((res) => (
                      <li key={res.id} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        <span>{res.value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400 italic font-sans text-sm">
              No work experience added yet
            </p>
          </div>
        )}
      </CVCard>

      {/* Modal for editing work experience */}
      {showModal && editingExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              onClick={() => {
                setShowModal(false);
                setEditingExperience(null);
              }}
            >
              ✕
            </button>
            <WorkExperienceForm
              editingExperience={editingExperience}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WorkExperienceSection;
