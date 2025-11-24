/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Achievement } from "../../types/cv/cv";
import AchievementFormDetails from "../forms/AchievementFormDetails";
import { deleteAchievementById } from "../../features/achievements/achievementsSlice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";

interface Props {
  cv: User;
  refetchCV: () => Promise<void>;
}

const AchievementsSection = ({ cv,refetchCV }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  // Use achievements directly from cv data
  const achievements: Achievement[] = cv.achievement_profile?.achievements || [];

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showModal, setShowModal] = useState(false);

const handleDelete = async (id?: number) => {
  if (!id) return;

  try {
    const confirmed = window.confirm("Are you sure you want to delete this achievement?");
    if (!confirmed) return;

     await dispatch(deleteAchievementById(id));
     await refetchCV();

   
  } catch (error) {
    console.error("Error deleting achievement:", error);
  }
};

  const handleDone = (updatedAchievement?: Achievement) => {
    // Close modal and reset editing state
    setEditingAchievement(null);
    setShowModal(false);

    // Optionally update local state or call API to save
    // console.log("Achievement saved/updated:", updatedAchievement);
  };

  return (
    <>
      <CVCard title="Achievements">
        {achievements.length === 0 ? (
          <p className="text-gray-400 italic font-sans text-sm">
            No achievements added yet
          </p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id || index}
                className="relative rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                <div className="absolute top-3 right-3 flex gap-3 text-sm">
                  <span
                    className="text-redMain font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setEditingAchievement(achievement);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-redMain cursor-pointer"
                    onClick={() => handleDelete(achievement.id)}
                  >
                    <FaTrash size={12} />
                  </span>
                </div>

                <p className="mt-4 text-sm text-subHeadingGray">{achievement.value}</p>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal for editing achievement */}
      {showModal && editingAchievement && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-background rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto transition-colors duration-300">
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-subheading hover:text-text font-bold text-lg transition-colors duration-200"
        onClick={() => setShowModal(false)}
        aria-label="Close Modal"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-2xl font-semibold text-subheading mb-4 text-center">
        Edit Achievement
      </h2>

      {/* Form */}
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
