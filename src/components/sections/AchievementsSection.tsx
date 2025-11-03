/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Achievement } from "../../types/cv/cv";
import AchievementFormDetails from "../forms/AchievementFormDetails";
import Loader from "../common/Loader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchAchievements,
  addAchievement,
  editAchievement,
  deleteAchievementById,

} from "../../features/achievements/achievementsSlice";

interface Props {
  cv: User;
}

const AchievementsSection = ({ cv }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { achievements, loading } = useSelector((state: RootState) => state.achievements);

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await dispatch(deleteAchievementById(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete achievement:", error);
    }
  };

  const handleDone = async (updatedAchievement?: Achievement) => {
    if (!updatedAchievement) {
      setEditingAchievement(null);
      setShowModal(false);
      return;
    }

    try {
      if (updatedAchievement.id) {
        // Update existing achievement
        await dispatch(editAchievement({ id: updatedAchievement.id, data: updatedAchievement })).unwrap();
      } else {
        // Add new achievement
        await dispatch(addAchievement(updatedAchievement)).unwrap();
      }
    } catch (error) {
      console.error("Failed to save achievement:", error);
    } finally {
      setEditingAchievement(null);
      setShowModal(false);
    }
  };

  return (
    <>
      <CVCard title="Achievements">
        {loading ? (
          <Loader loading={loading} message="Loading achievements..." />
        ) : achievements.length === 0 ? (
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
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer font-bold text-lg"
              onClick={() => setShowModal(false)}
            >
              ✕
            </span>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Achievement
            </h2>

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
