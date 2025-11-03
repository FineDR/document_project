/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { FaTrash } from "react-icons/fa";
import { CVCard } from "../../utils/CVCard";
import Loader from "../common/Loader";
import CareerObjectiveFormDetails from "../forms/CareerObjective";

import {
  fetchCareerObjectives,
  addCareerObjective,
  updateCareerObjectiveById,
  deleteCareerObjectiveById,
} from "../../features/carerobjectives/carerObjectivesSlice";
import type { CareerObjective, User } from "../../types/cv/cv";
import { useTimedLoader } from "../../hooks/useTimedLoader";

interface Props {
  cv: User;
}

const CareerObjectiveSection = ({ cv }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { CareerObjectives, loading } = useSelector(
    (state: RootState) => state.carerObjectives
  );

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [loadingDeleteIndex, setLoadingDeleteIndex] = useState<number | null>(null);
  const { loading: loaderActive, withLoader } = useTimedLoader(1500);

  // Load career objectives from API or use preloaded ones from cv
  useEffect(() => {
    if (!CareerObjectives.length && cv.id) {
      dispatch(fetchCareerObjectives());
    }
  }, [dispatch, CareerObjectives.length, cv.id]);

  const handleDelete = async (index: number) => {
    const objToDelete = CareerObjectives[index];
    if (!objToDelete?.id) return;

    await withLoader(async () => {
      try {
        setLoadingDeleteIndex(index);
        await dispatch(deleteCareerObjectiveById(objToDelete.id)).unwrap();
      } catch (error) {
        console.error("Failed to delete career objective:", error);
      } finally {
        setLoadingDeleteIndex(null);
      }
    });
  };

  const handleDone = async (updated: CareerObjective, index?: number) => {
    await withLoader(async () => {
      try {
        if (index !== undefined && updated.id) {
          await dispatch(
            updateCareerObjectiveById({
              id: updated.id,
              data: { career_objective: updated.career_objective },
            })
          ).unwrap();
        } else {
          await dispatch(
            addCareerObjective({ career_objective: updated.career_objective })
          ).unwrap();
        }
        setActiveModalIndex(null);
      } catch (error) {
        console.error("Failed to save career objective:", error);
      }
    });
  };

  return (
    <>
      <CVCard title="Career Objectives">
        {loading && <Loader loading={true} message="Loading career objectives..." />}

        {!loading && CareerObjectives.length === 0 ? (
          <p className="text-gray-400 italic font-sans">
            No career objectives added yet
          </p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {CareerObjectives.map((obj, index) => (
              <div
                key={obj.id || index}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                <div className="absolute top-4 right-4 flex gap-3">
                  <button
                    className="text-redMain font-medium hover:underline text-sm"
                    onClick={() => setActiveModalIndex(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:text-redMain"
                    onClick={() => handleDelete(index)}
                    disabled={loadingDeleteIndex === index || loaderActive}
                  >
                    {loadingDeleteIndex === index ? "⏳" : <FaTrash />}
                  </button>
                </div>
                <p className="mt-2">{obj.career_objective}</p>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Edit Modal */}
      {activeModalIndex !== null && CareerObjectives[activeModalIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              onClick={() => setActiveModalIndex(null)}
            >
              ✕
            </button>

            <h2 className="text-h2 font-semibold text-subHeadingGray mb-4">
              Edit Career Objective
            </h2>

            <CareerObjectiveFormDetails
              editingObjective={CareerObjectives[activeModalIndex]}
              editingIndex={activeModalIndex}
              onDone={(updated) => handleDone(updated, activeModalIndex)}
            />

            {loaderActive && (
              <Loader loading={loaderActive} message="Processing your request..." />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CareerObjectiveSection;
