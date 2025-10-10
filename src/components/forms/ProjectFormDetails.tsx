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

  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";
  const handleOnclick = () => setActive(!active);

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
      <div className="relative border p-4 rounded-lg bg-white m-4">
        {/* Guidance message at top */}
        <p className="text-gray-600 text-sm mb-4 text-center">
          Add your projects clearly — include title, description, technologies used, and links if any.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 m-4 mx-auto"
        >
          {projectFields.map((project, index) => (
            <div
              key={(project as any).id ?? index}
              className="p-4 mb-6 relative "
            >
              {/* Pass showHelperText to display helper tips */}
              <ProjectInput
                projectIndex={index}
                disabled={loading}
                showHelperText
              />

              {projectFields.length > 1 && !existingProjects && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  disabled={loading}
                  className="text-red-600 underline mx-4 disabled:opacity-50"
                >
                  Remove Project
                </button>
              )}

              {existingProjects && (project as any).id && (
                <button
                  type="button"
                  onClick={() => handleDelete((project as any).id)}
                  disabled={loading}
                  className="text-red-600 underline mx-4 disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-4 flex-wrap mx-4">
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
                className="text-green-600 mx-4 disabled:opacity-50"
              />
            )}

            <Button
              type="submit"
              label={existingProjects ? "Update" : "Submit"}
              onClick={handleOnclick}
              disabled={loading}
              className={`${active ? hoverStyle : ""} disabled:opacity-50`}
            />
          </div>

          <Loader
            loading={loading}
            message={existingProjects ? "Updating project..." : "Saving project..."}
          />
        </form>

        {successMessage && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
            {successMessage}
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default ProjectFormDetails;
