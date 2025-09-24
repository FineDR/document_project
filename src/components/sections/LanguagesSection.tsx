import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Language } from "../../types/cv/cv";
import LanguagesFormDetails from "../forms/LanguagesForm ";
import { deleteLanguage } from "../../api/languages";

interface Props {
  cv: User;
}

const LanguagesSection = ({ cv }: Props) => {
  const [languages, setLanguages] = useState<Language[]>(cv.languages || []);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setLoadingDelete(id);
      await deleteLanguage(id);
      setLanguages(prev => prev.filter(lang => lang.id !== id));
    } catch (error) {
      console.error("Failed to delete language:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleDone = (updatedLanguage?: Language) => {
    if (updatedLanguage) {
      const exists = languages.find(lang => lang.id === updatedLanguage.id);
      if (exists) {
        setLanguages(prev =>
          prev.map(lang => (lang.id === updatedLanguage.id ? updatedLanguage : lang))
        );
      } else {
        setLanguages(prev => [...prev, updatedLanguage]);
      }
    }
    setEditingLanguage(null);
    setShowModal(false);
  };

  return (
    <>
      <CVCard title="Languages">
        {languages.length === 0 ? (
          <p className="text-gray-500 italic">No languages added yet</p>
        ) : (
          <div className="space-y-4">
            {languages.map(lang => (
              <div
                key={lang.id}
                className="relative transition-all duration-300 ease-in-out bg-white rounded-lg overflow-hidden border border-gray-200 p-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                    {lang.language.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{lang.language}</p>
                    <p className="text-sm text-gray-600">{lang.proficiency}</p>
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-3">
                  {/* Delete button */}
                  

                  {/* Edit as text */}
                  <span
                    className="text-blue-600 cursor-pointer text-sm hover:underline"
                    onClick={() => {
                      setEditingLanguage(lang);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
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

      {/* Modal for editing single language */}
      {showModal && editingLanguage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </span>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Edit Language
            </h2>

            <LanguagesFormDetails
              editingLanguage={editingLanguage}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LanguagesSection;
