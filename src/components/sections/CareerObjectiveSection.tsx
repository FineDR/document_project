/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, CareerObjective } from "../../types/cv/cv";
import CareerObjectiveFormDetails from "../forms/CareerObjective";
import {
  submitCareerObjective,
  updateCareerObjective,
  deleteCareerObjective,
} from "../../api/submitCareerObjective";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";

interface Props {
  cv: User;
}

const CareerObjectiveSection = ({ cv }: Props) => {
  const [careerObjectives, setCareerObjectives] = useState<CareerObjective[]>(
    cv.career_objectives?.filter((obj) => obj.career_objective.trim() !== "") || []
  );
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [loadingDeleteIndex, setLoadingDeleteIndex] = useState<number | null>(null);

  const { loading: loaderActive, withLoader } = useTimedLoader(1500);

  const handleDelete = async (index: number) => {
    const objToDelete = careerObjectives[index];
    if (!objToDelete?.id) return;

    await withLoader(async () => {
      try {
        setLoadingDeleteIndex(index);
        await deleteCareerObjective(objToDelete.id);
        setCareerObjectives((prev) => prev.filter((_, i) => i !== index));
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
        let savedObj: CareerObjective;

        if (index !== undefined) {
          savedObj = await updateCareerObjective(updated.id!, {
            career_objective: updated.career_objective,
          });
          setCareerObjectives((prev) =>
            prev.map((item, i) => (i === index ? savedObj : item))
          );
        } else {
          savedObj = await submitCareerObjective({
            career_objective: updated.career_objective,
          });
          setCareerObjectives((prev) => [...prev, savedObj]);
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
        {careerObjectives.length === 0 ? (
          <p className="text-gray-400 italic font-sans">
            No career objectives added yet
          </p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {careerObjectives.map((obj, index) => (
              <div
                key={obj.id}
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

      {/* Modal for editing career objective */}
      {activeModalIndex !== null && careerObjectives[activeModalIndex] && (
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
              editingObjective={careerObjectives[activeModalIndex]}
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
