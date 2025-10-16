/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, SkillSet } from "../../types/cv/cv";
import SkillsForm from "../forms/SkillsForm";
import { deleteSkill } from "../../api/submitSkills";

interface Props {
  cv: User;
}

const SkillsSection = ({ cv }: Props) => {
  const skillSet = cv.skill_sets?.[0];
  const [skillsData, setSkillsData] = useState<SkillSet | null>(skillSet || null);
  const [showForm, setShowForm] = useState(false);
  const [editingSkillType, setEditingSkillType] = useState<"technical" | "soft" | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const technicalSkills =
    skillsData?.technical_skills?.filter((s) => s.value.trim() !== "") || [];
  const softSkills =
    skillsData?.soft_skills?.filter((s) => s.value.trim() !== "") || [];
  const hasSkills = technicalSkills.length > 0 || softSkills.length > 0;

  const handleEdit = (type: "technical" | "soft") => {
    setEditingSkillType(type);
    setShowForm(true);
  };

  const handleDelete = async (type: "technical" | "soft", skillId: number) => {
    if (!skillsData) return;
    try {
      setLoadingDelete(skillId);
      await deleteSkill(skillId);
      setSkillsData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          technical_skills:
            type === "technical"
              ? prev.technical_skills.filter((s) => s.id !== skillId)
              : prev.technical_skills,
          soft_skills:
            type === "soft"
              ? prev.soft_skills.filter((s) => s.id !== skillId)
              : prev.soft_skills,
        };
      });
    } catch (error) {
      console.error("Failed to delete skill:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSkillType(null);
  };

  const handleUpdateSkills = (updatedSkillSet: SkillSet) => {
    setSkillsData(updatedSkillSet);
    handleCloseForm();
  };

  return (
    <>
      <CVCard title="Skills">
        {!hasSkills ? (
          <p className="font-sans text-subHeadingGray italic text-sm">
            No skills added yet
          </p>
        ) : (
          <div className="space-y-6 font-sans text-subHeadingGray">
            {/* Technical Skills Card */}
            <div className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200">
              <div className="flex justify-between items-center mb-4 text-sm">
                <h4 className="font-semibold text-base text-subHeadingGray">
                  Technical Skills
                </h4>
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => handleEdit("technical")}
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {technicalSkills.length > 0 ? (
                  technicalSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                    >
                      {skill.value}
                      {skill.id && (
                        <button
                          onClick={() => handleDelete("technical", skill.id)}
                          disabled={loadingDelete === skill.id}
                          className="text-gray-400 hover:text-redMain text-sm"
                        >
                          {loadingDelete === skill.id ? "⏳" : <FaTrash size={12} />}
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="italic text-sm text-subHeadingGray">
                    No technical skills added
                  </p>
                )}
              </div>
            </div>

            {/* Soft Skills Card */}
            <div className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200">
              <div className="flex justify-between items-center mb-4 text-sm">
                <h4 className="font-semibold text-base text-subHeadingGray">
                  Soft Skills
                </h4>
                <button
                  className="text-purple-600 hover:underline text-sm"
                  onClick={() => handleEdit("soft")}
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {softSkills.length > 0 ? (
                  softSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                    >
                      {skill.value}
                      {skill.id && (
                        <button
                          onClick={() => handleDelete("soft", skill.id)}
                          disabled={loadingDelete === skill.id}
                          className="text-gray-400 hover:text-redMain text-sm"
                        >
                          {loadingDelete === skill.id ? "⏳" : <FaTrash size={12} />}
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="italic text-sm text-subHeadingGray">
                    No soft skills added
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CVCard>

      {/* Modal for editing skills */}
      {showForm && editingSkillType && skillsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              onClick={handleCloseForm}
            >
              ✕
            </button>
            <h2 className="text-base font-semibold mb-4 text-center">
              Edit {editingSkillType === "technical" ? "Technical Skills" : "Soft Skills"}
            </h2>
            <SkillsForm
              skillSet={skillsData}
              onClose={handleCloseForm}
              onUpdate={handleUpdateSkills}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SkillsSection;
