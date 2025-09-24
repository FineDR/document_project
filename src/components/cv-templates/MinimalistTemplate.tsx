import React from "react";
import type { User } from "../../types/cv/cv";

interface MinimalistTemplateProps {
  data: User;
}

const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({ data }) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });

  return (
    <div className="max-w-4xl mx-auto bg-white print:max-w-none font-serif">
      {/* Header */}
      <header className="mb-8 p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          {data.profiles.full_name.toUpperCase()}
        </h1>
        
        {/* Contact Information in Two Columns */}
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Contact Column */}
          <div className="text-left">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">Contact</h2>
            {data.profiles.email && (
              <p className="text-sm"><span className="font-bold">Email:</span> {data.profiles.email}</p>
            )}
            {data.personal_details.phone && (
              <p className="text-sm"><span className="font-bold">Phone:</span> {data.personal_details.phone}</p>
            )}
            {data.personal_details.address && (
              <p className="text-sm"><span className="font-bold">Address:</span> {data.personal_details.address}</p>
            )}
          </div>
          
          {/* Online Column */}
          <div className="text-left">
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">Online</h2>
            {data.personal_details.linkedin && (
              <p className="text-sm"><span className="font-bold">LinkedIn:</span> {data.personal_details.linkedin}</p>
            )}
            {data.personal_details.github && (
              <p className="text-sm"><span className="font-bold">GitHub:</span> {data.personal_details.github}</p>
            )}
            {data.personal_details.website && (
              <p className="text-sm"><span className="font-bold">Website:</span> {data.personal_details.website}</p>
            )}
          </div>
        </div>
      </header>

      <div className="px-6">
        {/* Career Objectives */}
        {/* {data.career_objectives.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Career Objectives</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.career_objectives.map((obj) => (
                <li key={obj.id}>{obj.career_objective}</li>
              ))}
            </ul>
          </section>
        )} */}

        {/* Profile Summary */}
        {data.personal_details.profile_summary && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Profile Summary</h2>
            <p className="text-sm leading-relaxed">
              {data.personal_details.profile_summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data.work_experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Experience</h2>
            <div className="space-y-4">
              {data.work_experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold">{exp.job_title}</h3>
                      <p className="text-sm text-gray-600">{exp.company}, {exp.location}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.responsibilities.map((resp) => (
                      <li key={resp.id} className="text-sm flex">
                        <span className="mr-2">•</span>
                        <span>{resp.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.educations.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Education</h2>
            <div className="space-y-4">
              {data.educations.map((edu) => (
                <div key={edu.id} className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution}, {edu.location}</p>
                      <p className="text-sm text-gray-500">Grade: {edu.grade}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Projects</h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="text-base font-bold">{project.title}</h3>
                  <p className="text-sm">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-sm mt-1">
                      <span className="font-bold">Technologies:</span> {project.technologies.map(t => t.value).join(', ')}
                    </p>
                  )}
                  {project.link && (
                    <p className="text-sm mt-1">
                      <span className="font-bold">Project Link:</span> {project.link}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skill_sets.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Skills</h2>
            {data.skill_sets[0].technical_skills.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-bold">Technical Skills:</p>
                <p className="text-sm">{data.skill_sets[0].technical_skills.map(s => s.value).join(', ')}</p>
              </div>
            )}
            {data.skill_sets[0].soft_skills.length > 0 && (
              <div>
                <p className="text-sm font-bold">Soft Skills:</p>
                <p className="text-sm">{data.skill_sets[0].soft_skills.map(s => s.value).join(', ')}</p>
              </div>
            )}
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Languages</h2>
            <div className="space-y-1">
              {data.languages.map((lang) => (
                <p key={lang.id} className="text-sm">{lang.language} - {lang.proficiency}</p>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.profiles.certificates.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">Certifications</h2>
            <div className="space-y-2">
              {data.profiles.certificates.map((cert) => (
                <p key={cert.id} className="text-sm">{cert.name}, {cert.issuer} ({formatDate(cert.date)})</p>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-blue-800 uppercase mb-3">References</h2>
            <div className="space-y-2">
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <p className="text-sm font-bold">{ref.name}</p>
                  <p className="text-sm">{ref.position}</p>
                  <p className="text-sm">{ref.email} · {ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalistTemplate;