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
          <div className="space-y-6">
            {workExperiences.map((exp) => (
              <div
                key={exp.id}
                className="relative transition-all duration-300 ease-in-out bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md group"
              >
                {/* Top-right buttons: Edit & Delete */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => {
                      setEditingExperience(exp);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDelete(exp.id)}
                    disabled={loadingDelete === exp.id}
                  >
                    {loadingDelete === exp.id ? "⏳" : <FaTrash size={18} />}
                  </button>
                </div>
                    <hr className="mt-8" />
                {/* Job title, company, location */}
                <div className="mb-3 mt-4">
                  <h4 className="font-semibold text-gray-800">
                    {exp.job_title}
                  </h4>
                  <p className="text-gray-700">
                    {exp.company} – {exp.location}
                  </p>

                  {/* Dates */}
                  <div className="flex flex-col sm:w-1/5 md:w-1/2 sm:gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Start: {exp.start_date}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1 sm:mt-0">
                      End: {exp.end_date || "Present"}
                    </span>
                  </div>
                </div>

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 pl-5">
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
          <div className="text-center py-3 top-9 absolute">
            <p className="text-gray-500 italic">No work experience added yet</p>
          </div>
        )}
      </CVCard>

      {showModal && editingExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-10 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
