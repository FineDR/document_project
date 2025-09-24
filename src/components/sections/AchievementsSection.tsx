import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Achievement } from "../../types/cv/cv";
import AchievementFormDetails from "../forms/AchievementFormDetails";
import { deleteAchievement } from "../../api/achievements";

interface Props {
  cv: User;
}

const AchievementsSection = ({ cv }: Props) => {
  const [achievements, setAchievements] = useState<Achievement[]>(
    cv.achievement_profile?.achievements || []
  );
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setLoadingDelete(id);
      await deleteAchievement(id);
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete achievement:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleDone = async (updatedAchievement?: Achievement) => {
    if (updatedAchievement) {
      const exists = achievements.find((a) => a.id === updatedAchievement.id);
      if (exists) {
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === updatedAchievement.id ? updatedAchievement : a
          )
        );
      } else {
        setAchievements((prev) => [...prev, updatedAchievement]);
      }
    }
    setEditingAchievement(null);
    setShowModal(false);
  };

  return (
    <>
      <CVCard title="Achievements">
        {achievements.length === 0 ? (
          <p className="text-gray-500 italic">No achievements added yet</p>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id || index}
                className="relative transition-all duration-300 ease-in-out bg-white rounded-lg overflow-hidden border border-gray-200 p-4 group"
              >
                <div className="absolute top-2 right-2 flex gap-3">
                  {/* Delete button with icon */}

                  {/* Edit text button */}
                  <span
                    className="text-blue-600 cursor-pointer text-sm hover:underline"
                    onClick={() => {
                      setEditingAchievement(achievement);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                    onClick={() => handleDelete(achievement.id)}
                  >
                    {loadingDelete === achievement.id ? "⏳" : <FaTrash />}
                  </span>
                </div>
                <br />
                <hr />
                <p className="mt-4">
                  <span>{achievement.value}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal for editing single achievement */}
      {showModal && editingAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </span>
         

            <AchievementFormDetails
              editingAchievement={editingAchievement}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AchievementsSection;
