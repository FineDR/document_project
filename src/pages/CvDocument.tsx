/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  FaUser,
  FaBriefcase,
  FaBullseye,
  FaStar,
  FaGraduationCap,
  FaLanguage,
  FaCertificate,
  FaProjectDiagram,
  FaTrophy,
  FaAddressBook,
  FaEdit,
} from "react-icons/fa";

import { useAppSelector } from "../hooks/reduxHooks";

import PersonalDetailsForm from "../components/forms/PersonalDetailsForm";
import LanguagesForm from "../components/forms/LanguagesForm ";
import WorkExperienceForm from "../components/forms/WorkExperience";
import CareerObjective from "../components/forms/CareerObjective";
import EducationFormDetails from "../components/forms/EducationFormDetails";
import CertificateFormDetails from "../components/forms/CertificateFormDetails";
import ProjectFormDetails from "../components/forms/ProjectFormDetails";
import AchievementFormDetails from "../components/forms/AchievementFormDetails";
import ReferencesFormDetails from "../components/forms/ReferencesFormDetails";
import SkillsForm from "../components/forms/SkillsForm";

// Sidebar sections
const categories = [
  { key: "personal_information", label: "Personal Information", icon: <FaUser /> },
  { key: "work_experience", label: "Work Experience", icon: <FaBriefcase /> },
  { key: "career_objective", label: "Career Objective", icon: <FaBullseye /> },
  { key: "skills", label: "Skills", icon: <FaStar /> },
  { key: "education", label: "Education", icon: <FaGraduationCap /> },
  { key: "language", label: "Language", icon: <FaLanguage /> },
  { key: "certification", label: "Certification", icon: <FaCertificate /> },
  { key: "projects", label: "Projects", icon: <FaProjectDiagram /> },
  { key: "achievements", label: "Achievements", icon: <FaTrophy /> },
  { key: "references", label: "References", icon: <FaAddressBook /> },
];

// Mapping category keys → form components
const categoryComponents: Record<string, React.ComponentType<any>> = {
  personal_information: PersonalDetailsForm,
  language: LanguagesForm,
  work_experience: WorkExperienceForm,
  career_objective: CareerObjective,
  education: EducationFormDetails,
  certification: CertificateFormDetails,
  projects: ProjectFormDetails,
  achievements: AchievementFormDetails,
  references: ReferencesFormDetails,
  skills: SkillsForm,
};

const CvDocument = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ✅ Get auth state from Redux
  const { access, user } = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(access && user);

  const SelectedComponent = selectedCategory ? categoryComponents[selectedCategory] : null;

  return (
    <div className="h-screen bg-gray-100 sm:p-8 mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Fill Your CV Details Below
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-150px)]">
        {/* Sidebar */}
        <aside className="col-span-1 bg-white rounded-xl border shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-2 uppercase">
            CV Sections
          </h3>
          <p className="text-xs text-center text-gray-400 mb-4">Select a section to fill</p>
          <hr className="text-red-500" />

          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.key}>
                <button
                  onClick={() => setSelectedCategory(category.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all 
                    ${
                      selectedCategory === category.key
                        ? "bg-red-100 text-red-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Content */}
        <main className="col-span-1 md:col-span-3 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <div className="flex items-center gap-2">
              <FaEdit className="text-red-500 text-xl" />
              <h2 className="text-lg font-semibold text-gray-700">CV Editor</h2>
            </div>
            <span className="text-xs text-gray-400 italic">Customize each section</span>
          </div>

          <div className="min-h-[200px]">
            {SelectedComponent ? (
              isLoggedIn ? (
                selectedCategory === "skills" ? (
                  <SelectedComponent
                    skillSet={user?.skill_sets} // pass existing skills if any
                    onClose={() => setSelectedCategory(null)}
                    onUpdate={(updatedSkillSet: any) => {
                      console.log("Updated skills:", updatedSkillSet);
                      // Optionally update Redux or local state here
                    }}
                  />
                ) : (
                  <SelectedComponent />
                )
              ) : (
                <p className="text-red-500 text-center text-sm mt-10">
                  🚫 You must be logged in to access this section.
                </p>
              )
            ) : (
              <p className="text-gray-500 text-sm text-center mt-10">
                Please select a section from the left to begin editing your CV.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CvDocument;
