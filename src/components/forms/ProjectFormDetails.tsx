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
import {
  submitProjectDetails,
  updateProject,
  deleteProject,
} from "../../api/submitProjectDetails";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";

type FormFields = z.infer<typeof projectSchema>;

interface Props {
  existingProjects?: FormFields["projects"];
  onDone?: (updatedProject?: any) => void;
}

const ProjectFormDetails: React.FC<Props> = ({ existingProjects, onDone }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(1000);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";

  const methods = useForm<FormFields>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: existingProjects || [
        { title: "", description: "", link: "", technologies: [{ value: "" }] },
      ],
    },
  });

  const { control, handleSubmit, reset } = methods;
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control, name: "projects" });

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

  if (!user) return <p className="text-red-500">Not logged in</p>;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      const payload = { ...data, email: user.email };

      try {
        let message = "";

        if (existingProjects && existingProjects.length > 0) {
          const updatedProjects = await Promise.all(
            data.projects.map((proj, idx) =>
              updateProject((existingProjects as any)[idx].id, proj)
            )
          );
          message = "✅ Projects updated successfully.";
          updatedProjects.forEach((proj) => onDone?.(proj));
          reset({ projects: updatedProjects });
        } else {
          const response = await submitProjectDetails(payload);
          message = "✅ Projects submitted successfully.";
          reset({
            projects: response.projects || [
              { title: "", description: "", link: "", technologies: [{ value: "" }] },
            ],
          });
          onDone?.();
        }

        setSuccessMessage(message);
      } catch (error) {
        console.error("Error submitting projects:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  const handleDelete = async (projectId?: string) => {
    if (!projectId) return;
    await withLoader(async () => {
      try {
        await deleteProject(projectId);
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

  return (
    <FormProvider {...methods}>
      <section className="w-full mx-auto p-6 bg-whiteBg border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {existingProjects ? "Edit Projects" : "Add Project Details"}
        </h2>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Add your projects clearly — include title, description, technologies used, and links if any. Required fields are marked with *.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {projectFields.map((project, index) => (
            <div key={(project as any).id ?? index} className="p-4 mb-6 relative">
              <ProjectInput
                projectIndex={index}
                disabled={loading}
                showHelperText
              />

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

          <div className="flex flex-wrap gap-4 justify-start">
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
                className="bg-red-600 text-white hover:bg-red-700"
              />
            )}

            <Button
              type="submit"
              label={existingProjects ? "Update" : "Submit"}
              onClick={handleOnClick}
              disabled={loading}
              className={`${active ? hoverStyle : ""} bg-red-600 text-white hover:bg-red-700`}
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
      </section>
    </FormProvider>
  );
};

export default ProjectFormDetails;
