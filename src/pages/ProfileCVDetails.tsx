// src/pages/CVPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import EducationSection from "../components/sections/EducationSection";
import PersonalInfoSection from "../components/sections/PersonalInfoSection";
import ReferencesSection from "../components/sections/ReferencesSection";
import LanguagesSection from "../components/sections/LanguagesSection";
import CertificationsSection from "../components/sections/CertificationsSection";
import AchievementsSection from "../components/sections/AchievementsSection";
import CareerObjectiveSection from "../components/sections/CareerObjectiveSection";
import WorkExperienceSection from "../components/sections/WorkExperienceSection";
import SkillsSection from "../components/sections/SkillsSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import Button from "../components/formElements/Button";
import { ClipLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useCurrentUserCV } from "../hooks/useCurrentUserCV";

const CVPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [signInIsOpen, setSignInIsOpen] = useState(!user);

  // ✅ Updated: remove user?.id
  const { data: cvData, loading, error } = useCurrentUserCV();

  const closeSignIn = () => setSignInIsOpen(false);
  // console.log("cvdata", cvData);
  // Handle token errors -> reopen sign-in modal
  useEffect(() => {
    if (error && typeof error === "object" && "detail" in error) {
      if (
        error.detail === "Invalid token." ||
        error.detail === "Given token not valid for any token type"
      ) {
        setSignInIsOpen(true);
      }
    }
  }, [error]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      setSignInIsOpen(true);
      navigate("/");
    } catch (err: any) {
      console.error("Logout failed:", err.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show SignIn modal if no user
  if (!user || signInIsOpen) {
  }

  // Show loader while fetching CV
  if (loading) {
    return (
      <main className="p-6 container mx-auto min-h-screen flex items-center justify-center">
        <ClipLoader color="#0f62fe" size={50} />
      </main>
    );
  }

  // Show error message if fetch fails
  if (error && !loading) {
    const errorMessage =
      typeof error === "string"
        ? error
        : "detail" in error
          ? error.detail
          : "Failed to load CV";

    return (
      <main className="p-6 container mx-auto min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load CV: {errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </main>
    );
  }

  // Show fallback if no CV data
  if (!cvData && !loading) {
    return (
      <main className="p-6 container mx-auto min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No CV data available.</p>
      </main>
    );
  }

  // ✅ Main CV Page
  return (
    <main className="p-6 container mx-auto min-h-screen mt-14 space-y-8">
      <section className="bg-whiteBg shadow-md rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-6">

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-redMain text-white flex items-center justify-center text-2xl font-bold">
            {user?.first_name?.charAt(0) ?? ""}
            {user?.last_name?.charAt(0) ?? ""}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {[user?.first_name, user?.middle_name, user?.last_name]
                .filter(Boolean)
                .join(" ")}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.email || "No email provided"}
            </p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          type="button"
          disabled={isLoggingOut}
          className={`${isLoggingOut
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
            } text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2`}
          label="Logout"
        >
          {isLoggingOut && <ClipLoader color="white" size={18} />}
          {isLoggingOut && <span>Logging out...</span>}
        </Button>
      </section>


      <div className="flex justify-end mx-4">
        <a href="/create/cv" className="text-redMain dark:text-white">Add Profile Details</a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <PersonalInfoSection cv={cvData!} />
        <ProjectsSection cv={cvData!} />
        <WorkExperienceSection cv={cvData!} />
        <EducationSection cv={cvData!} />
        <SkillsSection cv={cvData!} />
        <CertificationsSection cv={cvData!} />
        <AchievementsSection cv={cvData!} />
        <LanguagesSection cv={cvData!} />
        <ReferencesSection cv={cvData!} refetchCV={function (): Promise<void> {
          throw new Error("Function not implemented.");
        }} />
        <CareerObjectiveSection cv={cvData!} refetchCV={function (): Promise<void> {
          throw new Error("Function not implemented.");
        }} />
      </div>
    </main>
  );
};

export default CVPage;
