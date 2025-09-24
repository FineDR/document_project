/* SkillsSection.tsx */
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
  const [skillsData, setSkillsData] = useState<SkillSet | null>(
    skillSet || null
  );
  const [showForm, setShowForm] = useState(false);
  const [editingSkillType, setEditingSkillType] = useState<
    "technical" | "soft" | null
  >(null);
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
          <p className="text-gray-500 italic">No skills added yet</p>
        ) : (
          <>
            {/* Technical Skills */}
            <div className="relative transition-all duration-300 ease-in-out bg-white rounded-lg overflow-hidden border border-gray-200 p-4 group">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">
                  Technical Skills
                </h4>
                <button
                  onClick={() => handleEdit("technical")}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {technicalSkills.length > 0 ? (
                  technicalSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-2"
                    >
                      {skill.value}
                      {skill.id && (
                        <button
                          onClick={() => handleDelete("technical", skill.id)}
                          disabled={loadingDelete === skill.id}
                          className="text-gray-400 hover:text-red-600"
                        >
                          {loadingDelete === skill.id ? "⏳" : <FaTrash />}
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No technical skills added
                  </p>
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="relative transition-all duration-300 ease-in-out bg-white rounded-lg overflow-hidden border border-gray-200 p-4 group mt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">Soft Skills</h4>
                <button
                  onClick={() => handleEdit("soft")}
                  className="text-purple-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {softSkills.length > 0 ? (
                  softSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full flex items-center gap-2"
                    >
                      {skill.value}
                      {skill.id && (
                        <button
                          onClick={() => handleDelete("soft", skill.id)}
                          disabled={loadingDelete === skill.id}
                          className="text-gray-400 hover:text-red-600"
                        >
                          {loadingDelete === skill.id ? "⏳" : <FaTrash />}
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No soft skills added</p>
                )}
              </div>
            </div>
          </>
        )}
      </CVCard>

      {/* Modal Form */}
      {showForm && editingSkillType && skillsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseForm}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Edit{" "}
              {editingSkillType === "technical"
                ? "Technical Skills"
                : "Soft Skills"}
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
