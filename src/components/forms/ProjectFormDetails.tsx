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
import Loader from "../common/Loader"; // reusable loader component
import { useTimedLoader } from "../../hooks/useTimedLoader"; // ensures minimum display time

type FormFields = z.infer<typeof projectSchema>;

interface Props {
  existingProjects?: FormFields["projects"];
  onDone?: (updatedProject?: any) => void; // optional project callback
}

const ProjectFormDetails: React.FC<Props> = ({ existingProjects, onDone }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(1000); // minimum loader display

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
  } = useFieldArray({
    control,
    name: "projects",
  });
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-red-500/60";
  const handleOnclick = () => setActive(!active);
  useEffect(() => {
    if (existingProjects) reset({ projects: existingProjects });
  }, [existingProjects, reset]);

  if (!user) return <p>Not logged in</p>;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await withLoader(async () => {
      const payload = { ...data, email: user.email };
      try {
        if (existingProjects && existingProjects.length > 0) {
          const updatedProjects = await Promise.all(
            data.projects.map((proj, idx) =>
              updateProject((existingProjects as any)[idx].id, proj)
            )
          );
          updatedProjects.forEach((proj) => onDone?.(proj));
        } else {
          await submitProjectDetails(payload);
          onDone?.();
        }
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
        <h2 className="text-center text-primary text-2xl font-semibold mb-6">
          {existingProjects
            ? "Edit Projects"
            : "Fill the Projects Details Clearly"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 m-4 mx-auto"
        >
          {projectFields.map((project, index) => (
            <div
              key={(project as any).id ?? index}
              className="p-4 mb-6 relative"
            >
              <ProjectInput projectIndex={index} disabled={loading} />

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
            message={
              existingProjects ? "Updating project..." : "Saving project..."
            }
          />
        </form>
      </div>
    </FormProvider>
  );
};

export default ProjectFormDetails;
