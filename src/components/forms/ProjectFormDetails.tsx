/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Button from "../formElements/Button";
import ProjectInput from "../forms/subform/ProjectInput";
import { projectSchema } from "../forms/cvValidationSchema";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { aiTemplates } from "../../utils/aiTemplates";
import {
  addProject,
  updateProjectById,
  deleteProjectById,
} from "../../features/projects/projectsSlice";

import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { generateCV } from "../../features/auth/authSlice";

type FormFields = z.infer<typeof projectSchema>;

interface Props {
  existingProjects?: FormFields["projects"];
  onDone?: (updatedProject?: any) => void;
}

const ProjectFormDetails: React.FC<Props> = ({ existingProjects, onDone }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(1000);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";

  // --- AI States ---
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<any>(null);
  const [isAILoading, setAILoading] = useState(false);
const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("projects");
  const methods = useForm<FormFields>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: existingProjects || [
        { title: "", description: "", link: "", technologies: [{ value: "" }] },
      ],
    },
  });

  const { control, handleSubmit, reset } = methods;
  const { fields: projectFields, append: appendProject, remove: removeProject } =
    useFieldArray({ control, name: "projects" });

  const handleOnClick = () => setActive(!active);

  // Prefill form if editing
  useEffect(() => {
    if (existingProjects) reset({ projects: existingProjects });
  }, [existingProjects, reset]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return <p className="text-red-500 text-center mt-4">Not logged in</p>;

  /* --------------------------------------------------------
      FORM SUBMIT HANDLER
  -------------------------------------------------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      const interval = setInterval(
        () => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)),
        100
      );

      try {
        let message = "";

        // 1️⃣ Filter valid projects (title required)
        const validProjects = data.projects.filter((p) => p.title.trim() !== "");

        type ProjectWithId = { id: number; title: string; description: string; link: string; technologies: { value: string }[] };
        type ProjectWithoutId = Omit<ProjectWithId, "id">;

        const projectsToUpdate = validProjects.filter(
          (p): p is ProjectWithId => typeof (p as any).id === "number"
        );

        const projectsToAdd = validProjects.filter(
          (p): p is ProjectWithoutId => !(p as any).id
        );

        const finalProjects: ProjectWithId[] = [];

        // 2️⃣ Update existing projects
        for (const proj of projectsToUpdate) {
          const payload = {
            title: proj.title,
            description: proj.description,
            link: proj.link,
            technologies: proj.technologies.filter((t) => t.value.trim() !== ""),
          };

          const updatedProject = await dispatch(
            updateProjectById({ id: proj.id!, data: payload })
          ).unwrap();

          finalProjects.push({
            ...updatedProject,
            technologies: updatedProject.technologies || [],
          });
        }

        // 3️⃣ Add new projects
        for (const proj of projectsToAdd) {
          const payload = {
            title: proj.title,
            description: proj.description,
            link: proj.link,
            technologies: proj.technologies.filter((t) => t.value.trim() !== ""),
          };

          const newProject = await dispatch(addProject(payload)).unwrap();

          finalProjects.push({
            ...newProject,
            technologies: newProject.technologies || [],
          });
        }

        // 4️⃣ Reset form with backend IDs preserved
        reset({ projects: finalProjects });
        finalProjects.forEach((proj) => onDone?.(proj));

        message =
          finalProjects.length === validProjects.length
            ? "✅ Projects submitted successfully."
            : "✅ Projects updated/added successfully.";

        setSuccessMessage(message);
      } catch (error) {
        console.error("Error submitting projects:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  /* --------------------------------------------------------
      DELETE HANDLER
  -------------------------------------------------------- */
  const handleDelete = async (projectId?: number) => {
    if (!projectId) return;
    await withLoader(async () => {
      try {
        await dispatch(deleteProjectById(projectId)).unwrap();
        const updatedProjects = (projectFields as any).filter(
          (proj: any) => proj.id !== projectId
        );
        reset({ projects: updatedProjects });
        onDone?.();
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    });
  };

  /* --------------------------------------------------------
      AI HANDLERS
  -------------------------------------------------------- */
  // --- Generate AI Projects ---
  const handleGenerateProjectsFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      // Build dynamic prompt for 'projects' section
      const prompt = buildAIPromptDynamic("projects", { instruction_text: instructionText });

      // Dispatch thunk to request AI-generated CV data
      const resultAction = await dispatch(
        generateCV({
          section: "projects",
          userData: { instruction_text: prompt }, // ✅ key must be 'instruction_text'
        })
      ).unwrap();

      // Parse AI response; backend returns { projects: [...] }
      const parsedData = typeof resultAction === "string" ? JSON.parse(resultAction) : resultAction;

      const projects = Array.isArray(parsedData.projects) ? parsedData.projects : [];

      setAIData({ projects }); // Keep object for preview modal
      setAIModalOpen(false);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Error generating AI projects:", err);
    } finally {
      setAILoading(false);
    }
  };

  // --- Accept AI-generated Projects ---
  const handleAcceptProjectsAI = () => {
    if (!aiData || !aiData.projects) return;

    // Populate form with AI-generated projects
    reset({ projects: aiData.projects });
    setSuccessMessage("✅ AI-generated projects populated. Review before submission.");
    setPreviewOpen(false);
    setAIData(null);
  };

  /* --------------------------------------------------------
      RENDER
  -------------------------------------------------------- */
  return (
    <FormProvider {...methods}>
      <section className="w-full mx-auto p-6 bg-whiteBg border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {existingProjects ? "Edit Projects" : "Add Project Details"}
        </h2>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Add your projects clearly — include title, description, technologies used,
          and links if any. Required fields are marked with *.
        </p>

        {/* AI Button */}
        {!existingProjects && (
          <div className="flex justify-center mb-4">
            <Button
              type="button"
              label="✨ Autofill with AI"
              onClick={() => setAIModalOpen(true)}
              className="bg-primary text-white hover:bg-primary/90"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {projectFields.map((project, index) => (
            <div key={(project as any).id ?? index} className="p-4 mb-6 relative">
              <ProjectInput projectIndex={index} disabled={loading} showHelperText />

              {projectFields.length > 1 && !existingProjects && (
                <Button
                  type="button"
                  label="Remove Project"
                  onClick={() => removeProject(index)}
                  disabled={loading}
                  className="bg-red-500 text-white hover:bg-red-600 mt-2"
                />
              )}

              {existingProjects && (project as any).id && (
                <Button
                  type="button"
                  label="Delete Project"
                  onClick={() => handleDelete((project as any).id)}
                  disabled={loading}
                  className="bg-red-500 text-white hover:bg-red-600 mt-2"
                />
              )}
            </div>
          ))}

          <div className="flex flex-wrap gap-4 justify-start mx-2">
            {!existingProjects && (
              <Button
                type="button"
                label="+ Add Project"
                onClick={() =>
                  appendProject({
                    title: "",
                    description: "",
                    link: "",
                    technologies: [{ value: "" }],
                  })
                }
                disabled={loading}
                className="text-white mx-8"
              />
            )}

            <Button
              type="submit"
              label={existingProjects ? "Update" : "Submit"}
              onClick={handleOnClick}
              disabled={loading}
              className={`${active ? hoverStyle : ""} text-white`}
            />
          </div>

          <Loader
            loading={loading}
            message={loading ? `Processing projects... (${elapsedTime}s elapsed)` : ""}
          />
        </form>

        {successMessage && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
            {successMessage}
          </div>
        )}

        {/* --- AI Modals --- */}
        <AIInputModal
          isOpen={isAIModalOpen}
          onClose={() => setAIModalOpen(false)}
          onSubmit={handleGenerateProjectsFromAI}
          loading={isAILoading}
          defaultText={aiTemplates[currentSection]} // <-- template for that section
          title={`Edit ${currentSection.replace("_", " ")}`}
          description="You can edit this text. AI will extract the info and fill the form."
          placeholder="Example: I built a portfolio website with React and TailwindCSS."
          generateLabel="Generate Projects"
          cancelLabel="Cancel"
        />

        <AIPreviewModal
          isOpen={isPreviewOpen}
          data={aiData}
          onClose={() => setPreviewOpen(false)}
          onAccept={handleAcceptProjectsAI}
          title="Review Extracted Projects"
          description="Confirm the AI-generated projects before populating the form."
          acceptLabel="Accept & Autofill"
          discardLabel="Discard"
        />
      </section>
    </FormProvider>
  );
};

export default ProjectFormDetails;
