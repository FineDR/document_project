/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaX } from "react-icons/fa6";

type ProjectInputProps = {
  projectIndex: number;
  disabled?: boolean;
  showHelperText?: boolean;
};

const ProjectInput: React.FC<ProjectInputProps> = ({
  projectIndex,
  disabled = false,
  showHelperText = false,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control,
    name: `projects.${projectIndex}.technologies`,
  });

  const projectErrors = errors.projects as { [key: number]: any } | undefined;

  return (
    <div className="p-4 mb-6 space-y-5">
      {/* Project Title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* <label className="sm:w-1/4 font-medium text-gray-700">
          Project Title *
        </label> */}
        <div className="sm:flex-1">
          <input
            type="text"
            placeholder="e.g., Portfolio Website"
            {...register(`projects.${projectIndex}.title`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {projectErrors?.[projectIndex]?.title?.message && (
            <p className="text-red-500 text-sm mt-1">
              {projectErrors?.[projectIndex]?.title?.message}
            </p>
          )}
          {showHelperText && (
            <p className="text-gray-500 text-sm">
              Give a clear, short title of your project.
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* <label className="sm:w-1/4 font-medium text-gray-700">
          Description *
        </label> */}
        <div className="sm:flex-1">
          <textarea
            placeholder="Describe what you built..."
            {...register(`projects.${projectIndex}.description`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 h-24 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {projectErrors?.[projectIndex]?.description?.message && (
            <p className="text-red-500 text-sm mt-1">
              {projectErrors?.[projectIndex]?.description?.message}
            </p>
          )}
          {showHelperText && (
            <p className="text-gray-500 text-sm">
              Explain what the project does and your role in it.
            </p>
          )}
        </div>
      </div>

      {/* Project Link */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* <label className="sm:w-1/4 font-medium text-gray-700">Link</label> */}
        <div className="sm:flex-1">
          <input
            type="url"
            placeholder="e.g., https://github.com/username/project"
            {...register(`projects.${projectIndex}.link`)}
            disabled={disabled}
            className="w-full border rounded-md p-2 disabled:opacity-50 focus:ring-2 focus:ring-red-400"
          />
          {projectErrors?.[projectIndex]?.link?.message && (
            <p className="text-red-500 text-sm mt-1">
              {projectErrors?.[projectIndex]?.link?.message}
            </p>
          )}
          {showHelperText && (
            <p className="text-gray-500 text-sm">
              Optional: Add a live link or repository URL.
            </p>
          )}
        </div>
      </div>

      {/* Technologies */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* <label className="sm:w-1/4 font-medium text-gray-700 mt-2">
          Technologies
        </label> */}
        <div className="sm:flex-1">
          <div className="flex flex-wrap gap-3 items-center">
            {techFields.map((tech, techIndex) => (
              <div key={tech.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g., React, Node.js"
                  {...register(
                    `projects.${projectIndex}.technologies.${techIndex}.value`
                  )}
                  className="p-2 rounded border w-40 disabled:opacity-50"
                  disabled={disabled}
                />
                {techFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTech(techIndex)}
                    className="text-red-500 font-bold px-2 py-1 disabled:opacity-50"
                    disabled={disabled}
                    title="Remove technology"
                  >
                    <FaX className="text-sm" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTech({ value: "" })}
              className="text-green-600 hover:underline disabled:opacity-50"
              disabled={disabled}
            >
              + Add Technology
            </button>
          </div>

          {projectErrors?.[projectIndex]?.technologies && (
            <p className="text-red-500 text-sm mt-1">
              {(projectErrors?.[projectIndex]?.technologies as any)?.message}
            </p>
          )}
          {showHelperText && (
            <p className="text-gray-500 text-sm mt-1">
              Add the key technologies used in this project.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInput;
