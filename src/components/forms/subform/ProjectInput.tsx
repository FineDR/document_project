/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaX } from "react-icons/fa6";
import InputField from "../../formElements/InputField";

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
        <div className="sm:flex-1">
          <InputField
            name={`projects.${projectIndex}.title`}
            type="text"
            register={register(`projects.${projectIndex}.title`)}
            placeholder="e.g., Portfolio Website"
            disabled={disabled}
            error={projectErrors?.[projectIndex]?.title?.message}
          />
          {showHelperText && (
            <p className="text-gray-400 text-xs italic mt-1">
              Give a clear, short title of your project.
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="sm:flex-1">
          <InputField
            name={`projects.${projectIndex}.description`}
            type="textarea"
            register={register(`projects.${projectIndex}.description`)}
            placeholder="Describe what you built..."
            disabled={disabled}
            error={projectErrors?.[projectIndex]?.description?.message}
          />
          {showHelperText && (
            <p className="text-gray-400 text-xs italic mt-1">
              Explain what the project does and your role in it.
            </p>
          )}
        </div>
      </div>

      {/* Project Link */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="sm:flex-1">
          <InputField
            name={`projects.${projectIndex}.link`}
            type="url"
            register={register(`projects.${projectIndex}.link`)}
            placeholder="e.g., https://github.com/username/project"
            disabled={disabled}
            error={projectErrors?.[projectIndex]?.link?.message}
          />
          {showHelperText && (
            <p className="text-gray-400 text-xs italic mt-1">
              Optional: Add a live link or repository URL.
            </p>
          )}
        </div>
      </div>

      {/* Technologies */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="sm:flex-1">
          <div className="flex flex-wrap gap-3 items-center">
            {techFields.map((tech, techIndex) => (
              <div key={tech.id} className="flex items-center gap-2">
                <InputField
                  name={`projects.${projectIndex}.technologies.${techIndex}.value`}
                  type="text"
                  register={register(
                    `projects.${projectIndex}.technologies.${techIndex}.value`
                  )}
                  placeholder="e.g., React, Node.js"
                  disabled={disabled}
                  error={projectErrors?.[projectIndex]?.technologies?.[techIndex]?.value?.message}
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
            <p className="text-gray-400 text-xs italic mt-1">
              Add the key technologies used in this project.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInput;
