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

  // Reusable loader with minimum duration 1.5s
  const { loading: loaderActive, withLoader } = useTimedLoader(1500);

  // DELETE a single career objective
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

  // HANDLE update/add from modal form
  const handleDone = async (updated: CareerObjective, index?: number) => {
    await withLoader(async () => {
      try {
        let savedObj: CareerObjective;

        if (index !== undefined) {
          // Update existing
          savedObj = await updateCareerObjective(updated.id!, {
            career_objective: updated.career_objective,
          });
          setCareerObjectives((prev) =>
            prev.map((item, i) => (i === index ? savedObj : item))
          );
        } else {
          // Create new
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
          <p className="text-gray-500 italic">No career objectives added yet</p>
        ) : (
          <div className="space-y-4">
            {careerObjectives.map((obj, index) => (
              <div
                key={obj.id}
                className="transition-all duration-300 ease-in-out bg-white rounded-lg overflow-hidden border border-gray-200 p-4 relative group"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setActiveModalIndex(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:underline hover:text-red-500"
                    onClick={() => handleDelete(index)}
                    disabled={loadingDeleteIndex === index || loaderActive}
                  >
                    {loadingDeleteIndex === index ? "⏳" : <FaTrash size={16} />}
                  </button>
                </div>
                <br />
                <hr className="border-gray-100" />
                <p className="text-gray-700 mt-4">{obj.career_objective}</p>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modals: only open the active one */}
      {activeModalIndex !== null && careerObjectives[activeModalIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setActiveModalIndex(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Career Objective
            </h2>

            <CareerObjectiveFormDetails
              editingObjective={careerObjectives[activeModalIndex]}
              editingIndex={activeModalIndex}
              onDone={(updated) => handleDone(updated, activeModalIndex)}
            />

            {/* Global loader for modal */}
            {loaderActive && (
              <Loader
                loading={loaderActive}
                message="Processing your request..."
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CareerObjectiveSection;
