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
      prev.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
    setShowModal(false);
    setEditingProject(null);
  };

  return (
    <>
      <CVCard title="Projects">
        {projects.length === 0 ? (
          <p className="text-gray-500 italic">No projects added yet</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project: any, index: number) => (
              <div
                key={project.id || index}
                className="relative transition-all duration-300 ease-in-out bg-white rounded-lg border border-gray-200 p-4 group"
              >
                {/* Top-right actions */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => handleEditClick(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 text-sm hover:underline hover:text-red-500"
                    onClick={() => handleDelete(project.id)}
                    disabled={loadingDelete === project.id}
                  >
                    {loadingDelete === project.id ? (
                      "⏳"
                    ) : (
                      <FaTrash size={16} />
                    )}
                  </button>
                </div>

                {/* Divider */}
                <hr className="border-gray-200 mt-8" />

                {/* Project content */}
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="font-semibold text-gray-800">
                    {project.title}
                  </h4>
                  {project.position && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1.5 rounded-full">
                      {project.position}
                    </span>
                  )}

                  <p className="text-gray-700 mt-2">{project.description}</p>

                  {project.link && (
                    <p className="text-sm text-blue-600 mt-2">
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

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">
                        Technologies:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: any, i: number) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tech.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {showModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false);
                setEditingProject(null);
              }}
            >
              ✕
            </button>
            {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Project</h2> */}
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
