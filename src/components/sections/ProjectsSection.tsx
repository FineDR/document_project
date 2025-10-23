/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User } from "../../types/cv/cv";
import ProjectFormDetails from "../forms/ProjectFormDetails";
import { deleteProject } from "../../api/submitProjectDetails";

interface Props {
  cv: User;
}

const ProjectsSection = ({ cv }: Props) => {
  const [projects, setProjects] = useState<any[]>(cv.projects || []);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  const handleDelete = async (projectId?: string) => {
    if (!projectId) return;
    try {
      setLoadingDelete(projectId);
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((proj: any) => proj.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEditClick = (project: any) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDone = (updatedProject: any) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj))
    );
    setShowModal(false);
    setEditingProject(null);
  };

  return (
    <>
      <CVCard title="Projects">
        {projects.length === 0 ? (
          <p className="text-gray-400 italic font-sans">No projects added yet</p>
        ) : (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {projects.map((project: any, index: number) => (
              <div
                key={project.id || index}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                {/* Top-right actions */}
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

                {/* Project content */}
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-50">{project.title}</h4>
                  {project.position && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1.5 rounded-full w-fit">
                      {project.position}
                    </span>
                  )}
                  <p className="text-gray-700 mt-2 dark:text-white">{project.description}</p>
                  {project.link && (
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
                  {project.technologies?.length > 0 && (
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

      {/* Modal for editing project */}
      {showModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer font-bold text-lg"
              onClick={() => {
                setShowModal(false);
                setEditingProject(null);
              }}
            >
              ✕
            </span>

            <ProjectFormDetails
              existingProjects={[editingProject]}
              onDone={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
