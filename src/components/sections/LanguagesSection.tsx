/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Language } from "../../types/cv/cv";
import LanguagesFormDetails from "../forms/LanguagesForm";
import {
  fetchLanguages,
  addLanguage,
  updateLanguageById,
  deleteLanguageById,
} from "../../features/languages/languagesSlice";
import type { RootState } from "../../store/store";

interface Props {
  cv: User;
}

const LanguagesSection = ({ cv }: Props) => {
  const dispatch = useDispatch();
  const { languages: reduxLanguages, loading } = useSelector(
    (state: RootState) => state.languages
  );

  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  // Initialize with CV data if Redux is empty
  const [localLanguages, setLocalLanguages] = useState<Language[]>(
    reduxLanguages.length ? reduxLanguages : cv.languages || []
  );

  const handleDelete = (id?: number) => {
    if (!id) return;
    setLoadingDelete(id);
    dispatch(deleteLanguageById(id) as any)
      .unwrap()
      .catch((err: any) => console.error("Failed to delete language:", err))
      .finally(() => setLoadingDelete(null));
  };

  const handleDone = (updatedLanguage?: Language) => {
    if (!updatedLanguage) {
      setEditingLanguage(null);
      setShowModal(false);
      return;
    }

    if (updatedLanguage.id) {
      // Update existing language
      dispatch(updateLanguageById({ id: updatedLanguage.id, data: updatedLanguage }) as any)
        .unwrap()
        .catch((err: any) => console.error("Failed to update language:", err));
    } else {
      // Add new language
      dispatch(addLanguage(updatedLanguage) as any)
        .unwrap()
        .catch((err: any) => console.error("Failed to add language:", err));
    }

    setEditingLanguage(null);
    setShowModal(false);
  };

  return (
    <>
      <CVCard
        title="Languages"
        onEditClick={() => {
          setEditingLanguage(null);
          setShowModal(true);
        }}
      >
        {localLanguages.length === 0 ? (
          <p className="text-gray-400 italic font-sans">No languages added yet</p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {localLanguages.map((lang) => (
              <div
                key={lang.id}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-redMain text-redMain dark:text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {lang.language.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{lang.language}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-100">{lang.proficiency}</p>
                  </div>
                </div>

                {/* Top-right Edit/Delete buttons */}
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <span
                    className="text-redMain font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setEditingLanguage(lang);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-redMain cursor-pointer"
                    onClick={() => handleDelete(lang.id)}
                  >
                    {loadingDelete === lang.id ? "⏳" : <FaTrash />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer font-bold text-lg"
              onClick={() => setShowModal(false)}
            >
              ✕
            </span>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              {editingLanguage ? "Edit Language" : "Add Language"}
            </h2>

            <LanguagesFormDetails
              editingLanguage={editingLanguage || undefined}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LanguagesSection;
