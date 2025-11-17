import React from "react";
import { type User } from "../../types/cv/cv";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

interface ClassicTemplateProps {
  data: User;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };


  if (!data) {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-gray-500 text-lg">
      No CV data available.
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto bg-whiteBg shadow-lg print:shadow-none print:max-w-none font-serif">
      {/* Header */}
      <header className="text-center pb-6 mb-8 p-8 print:p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-2 print:text-3xl uppercase">
          {data.profile.full_name}
        </h1>
        <div className="border-b-4 border-gray-800 mx-auto w-3/4 mb-6"></div>
        
        {/* Contact Information Group */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaEnvelope className="text-blue-600" />
            <span>{data.profile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaPhone className="text-blue-600" />
            <span>{data.personal_details.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-blue-600" />
            <span>{data.personal_details.address}</span>
          </div>
        </div>
        
        {/* Links Group */}
        <div className="flex flex-wrap justify-center gap-6">
          {data.personal_details.linkedin && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaLinkedin className="text-blue-600" />
              <span>{data.personal_details.linkedin}</span>
            </div>
          )}
          {data.personal_details.github && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaGithub className="text-blue-600" />
              <span>{data.personal_details.github}</span>
            </div>
          )}
          {data.personal_details.website && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaGlobe className="text-blue-600" />
              <span>{data.personal_details.website}</span>
            </div>
          )}
        </div>
      </header>

      <div className="p-8 print:p-6">
        {/* Career Objective */}
        {data.career_objectives.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Career Objective
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.career_objectives[0]?.career_objective}
            </p>
          </section>
        )}

        {/* Professional Summary */}
        {data.personal_details.profile_summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.personal_details.profile_summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data.work_experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.work_experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                  <p className="text-gray-800 font-medium">
                    {exp.job_title} | {exp.company}, {exp.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                    {exp.responsibilities.map((resp) => (
                      <li key={resp.id}>{resp.value}</li>
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
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Education
            </h2>
            <div className="space-y-3">
              {data.educations.map((edu) => (
                <div key={edu.id} className="border-l-2 border-blue-200 pl-4">
                  <p className="text-gray-800 font-medium">
                    {edu.degree} | {edu.institution}, {edu.location}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)} | Grade: {edu.grade}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skill_sets.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800 mb-2">Technical Skills</h3>
                <p className="text-gray-700">
                  {data.skill_sets[0].technical_skills.map(skill => skill.value).join(', ')}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold text-blue-800 mb-2">Soft Skills</h3>
                <p className="text-gray-700">
                  {data.skill_sets[0].soft_skills.map(skill => skill.value).join(', ')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-2 border-blue-200 pl-4">
                  <p className="text-gray-800 font-medium">{project.title}</p>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <p className="text-gray-700 text-sm mb-1">
                    <span className="font-medium">Technologies:</span> {project.technologies.map(tech => tech.value).join(', ')}
                  </p>
                  {project.link && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Project Link:</span> {project.link}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Languages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.languages.map((lang) => (
                <div key={lang.id} className="bg-blue-50 p-3 rounded text-center">
                  <div className="font-medium text-blue-800">{lang.language}</div>
                  <div className="text-gray-600 text-sm">{lang.proficiency}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {data.profile.certificates.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              Certifications
            </h2>
            <div className="space-y-3">
              {data.profile.certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start border-l-2 border-blue-200 pl-4">
                  <div>
                    <span className="font-medium text-gray-800">{cert.name}</span>
                    <span className="text-gray-600 ml-2">- {cert.issuer}</span>
                  </div>
                  <span className="text-gray-500 text-sm bg-blue-50 px-2 py-1 rounded">
                    {formatDate(cert.date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-800 uppercase mb-2">
              References
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.references.map((ref) => (
                <div key={ref.id} className="bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-800">{ref.name}</h3>
                  <p className="text-gray-700 mb-1">{ref.position}</p>
                  <p className="text-gray-600 text-sm">{ref.email}</p>
                  <p className="text-gray-600 text-sm">{ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;