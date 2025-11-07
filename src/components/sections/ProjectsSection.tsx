/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Project } from "../../types/cv/cv";
import ProjectFormDetails from "../forms/ProjectFormDetails";
import {
  addProject,
  updateProjectById,
  deleteProjectById,
} from "../../features/projects/projectsSlice";

interface Props {
  cv: User;
}

const ProjectsSection = ({ cv }: Props) => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<Project[]>(cv.projects || []);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const handleDelete = async (projectId?: number) => {
    if (projectId === undefined) return;
    try {
      setLoadingDelete(projectId);
      await dispatch(deleteProjectById(projectId) as any).unwrap();
      setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error as any);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDone = async (updatedProject: Project) => {
    try {
      if (updatedProject.id) {
        await dispatch(
          updateProjectById({ id: updatedProject.id, data: updatedProject }) as any
        ).unwrap();
        setProjects((prev) =>
          prev.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj))
        );
      } else {
        const newProject = await dispatch(addProject(updatedProject) as any).unwrap();
        setProjects((prev) => [...prev, newProject]);
      }
    } catch (error) {
      console.error("Failed to save project:", error as any);
    } finally {
      setShowModal(false);
      setEditingProject(null);
    }
  };

  return (
    <>
      <CVCard title="Projects">
        {projects.length === 0 ? (
          <p className="text-gray-400 italic font-sans">No projects added yet</p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <span
                    className="text-redMain font-medium cursor-pointer hover:underline dark:text-redMain"
                    onClick={() => handleEditClick(project)}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-redMain cursor-pointer"
                    onClick={() => handleDelete(project.id)}
                  >
                    {loadingDelete === project.id ? "⏳" : <FaTrash />}
                  </span>
                </div>

                <hr className="border-gray-100 mt-6" />

                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-50">{project.title}</h4>

                  <p className="text-gray-700 mt-2 dark:text-white">{project.description}</p>

                  {"link" in project && project.link && (
                    <p className="text-sm text-redMain mt-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Visit Project
                      </a>
                    </p>
                  )}

                  {"technologies" in project && project.technologies?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((tech: any, i: number) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tech.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300 border border-gray-200 dark:border-gray-700">

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-subheading hover:text-primary font-bold text-lg transition-colors duration-200"
              onClick={() => {
                setShowModal(false);
                setEditingProject(null);
              }}
              aria-label="Close Modal"
            >
              ✕
            </button>



            {/* Form */}
            <ProjectFormDetails
              existingProjects={editingProject ? [editingProject] : []}
              onDone={handleDone}
            />
          </div>
        </div>
      )}

    </>
  );
};

export default ProjectsSection;
