/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import InputField from "../../formElements/InputField";
import { FaX } from "react-icons/fa6";

type ProjectInputProps = {
  projectIndex: number;
  disabled?: boolean; // New prop to control disabled state
};

const ProjectInput: React.FC<ProjectInputProps> = ({
  projectIndex,
  disabled = false,
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

  const projectErrors =
    errors.projects as // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { [key: number]: any } | undefined;

  return (
    <div className="p-4 mb-6 relative">
      <InputField
        type="text"
        label="Project Title *"
        placeholder="e.g., Portfolio Website"
        name={`projects.${projectIndex}.title`}
        register={register(`projects.${projectIndex}.title`)}
        error={projectErrors?.[projectIndex]?.title?.message}
        disabled={disabled}
      />

      <InputField
        type="text"
        label="Project Description *"
        placeholder="Describe what you built..."
        name={`projects.${projectIndex}.description`}
        register={register(`projects.${projectIndex}.description`)}
        error={projectErrors?.[projectIndex]?.description?.message}
        disabled={disabled}
      />

      <InputField
        type="url"
        label="Project Link"
        placeholder="e.g., https://github.com/username/project"
        name={`projects.${projectIndex}.link`}
        register={register(`projects.${projectIndex}.link`)}
        error={projectErrors?.[projectIndex]?.link?.message}
        disabled={disabled}
      />

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Technologies</h4>
        <div className="flex flex-wrap gap-3 items-center">
          {techFields.map((tech, techIndex) => (
            <div key={tech.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="eg, React, Node.js"
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
                  <FaX className="text-sm mb-4" />
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
      </div>
    </div>
  );
};

export default ProjectInput;
