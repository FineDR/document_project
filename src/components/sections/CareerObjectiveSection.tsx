/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { CareerObjective, User } from "../../types/cv/cv";
import CareerObjectiveFormDetails from "../forms/CareerObjective";
import {
  addCareerObjective,
  updateCareerObjectiveById,
  deleteCareerObjectiveById,
} from "../../features/carerobjectives/carerObjectivesSlice";

interface Props {
  cv: User;
  refetchCV?: () => Promise<void>; // optional to prevent "Function not implemented" error
}

const CareerObjectiveSection = ({ cv, refetchCV }: Props) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<CareerObjective | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const objectives = cv.career_objectives || [];

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setLoadingDelete(id);
      await dispatch(deleteCareerObjectiveById(id) as any).unwrap();
      if (refetchCV) await refetchCV(); // ✅ only call if defined
    } catch (error) {
      console.error("Failed to delete career objective:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEditClick = (objective: CareerObjective) => {
    setEditingObjective(objective);
    setShowModal(true);
  };

  const handleDone = async (updatedObjective?: CareerObjective) => {
    if (!updatedObjective) {
      setEditingObjective(null);
      setShowModal(false);
      return;
    }

    try {
      if (updatedObjective.id) {
        await dispatch(
          updateCareerObjectiveById({
            id: updatedObjective.id,
            data: updatedObjective,
          }) as any
        ).unwrap();
      } else {
        await dispatch(addCareerObjective(updatedObjective) as any).unwrap();
      }

      if (refetchCV) await refetchCV(); // ✅ safe refetch
    } catch (error) {
      console.error("Failed to save career objective:", error);
    } finally {
      setEditingObjective(null);
      setShowModal(false);
    }
  };

  return (
    <>
      <CVCard
        title="Career Objectives"
        onEditClick={() => {
          setEditingObjective(null);
          setShowModal(true);
        }}
      >
        {objectives.length === 0 ? (
          <p className="text-subheading italic font-sans">
            No career objectives added yet
          </p>
        ) : (
          <div className="space-y-4 font-sans text-subheading">
            {objectives.map((obj) => (
              <div
                key={`career-${obj.id ?? crypto.randomUUID()}`} // ✅ unique key
                className="relative rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:bg-muted transition-all duration-300"
              >
                {/* Top-right buttons */}
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <span
                    className="text-primary font-medium cursor-pointer hover:underline"
                    onClick={() => handleEditClick(obj)}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-primary cursor-pointer"
                    onClick={() => handleDelete(obj.id)}
                  >
                    {loadingDelete === obj.id ? "⏳" : <FaTrash />}
                  </span>
                </div>

                {/* Objective text */}
                <p className="mt-2 leading-relaxed text-text">
                  {obj.career_objective}
                </p>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Themed Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-subheading hover:text-primary font-bold text-lg"
              onClick={() => {
                setShowModal(false);
                setEditingObjective(null);
              }}
              aria-label="Close Modal"
            >
              ✕
            </button>

            {/* Modal header */}
            <h2 className="text-xl font-semibold text-text mb-4 text-center">
              {editingObjective ? "Edit Career Objective" : "Add Career Objective"}
            </h2>

            {/* Form */}
            <CareerObjectiveFormDetails
              editingObjective={editingObjective || undefined}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CareerObjectiveSection;
