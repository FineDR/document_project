import React from "react";
import { type User } from "../../types/cv/cv";
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaGithub, FaLinkedin, 
} from "react-icons/fa";

interface ModernTemplateProps {
  data: User;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  return (
    <div className="max-w-4xl mx-auto bg-whiteBg shadow-lg print:shadow-none print:max-w-none font-serif">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 print:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 print:text-3xl uppercase">
              {data.profile.full_name}
            </h1>
            {/* <div className="text-blue-100 text-lg">
              {data.career_objectives[0]?.career_objective}
            </div> */}
          </div>
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FaEnvelope size={16} />
              <span>{data.profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone size={16} />
              <span>{data.personal_details.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt size={16} />
              <span>{data.personal_details.address}</span>
            </div>
            {data.personal_details.linkedin && (
              <div className="flex items-center gap-2">
                <FaLinkedin size={16} />
                <span>{data.personal_details.linkedin}</span>
              </div>
            )}
            {data.personal_details.github && (
              <div className="flex items-center gap-2">
                <FaGithub size={16} />
                <span>{data.personal_details.github}</span>
              </div>
            )}
            {data.personal_details.website && (
              <div className="flex items-center gap-2">
                <FaGlobe size={16} />
                <span>{data.personal_details.website}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1 p-8 print:p-6">
          {/* Profile Summary */}
          {data.personal_details.profile_summary && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {data.personal_details.profile_summary}
              </p>
            </section>
          )}
          
          {/* Work Experience */}
          {data.work_experiences.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Work Experience
              </h2>
              <div className="space-y-6">
                {data.work_experiences.map((exp) => (
                  <div key={exp.id} className="pl-4">
                    <div className="flex flex-col mb-2">
                      <h3 className="text-base font-bold text-gray-800">
                        {exp.job_title} | {exp.company}, {exp.location}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm pl-4">
                      {exp.responsibilities.map((resp) => (
                        <li key={resp.id}>{resp.value}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects */}
          {data.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Projects
              </h2>
              <div className="space-y-6">
                {data.projects.map((project) => (
                  <div key={project.id} className="pl-4">
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2">
                      {project.description}
                    </p>
                    {project.link && (
                      <p className="text-gray-600 text-sm mb-1">
                        Link: {project.link}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">
                      Technologies: {project.technologies.map(t => t.value).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        
        {/* Sidebar */}
        <aside className="lg:w-80 bg-gray-50 p-8 print:p-6">
          {/* Education */}
          {data.educations.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {data.educations.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {edu.degree} | {edu.institution}, {edu.location}
                    </h3>
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
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Skills
              </h2>
              <div className="space-y-4">
                {data.skill_sets[0].technical_skills.length > 0 && (
                  <div>
                    <p className="font-bold text-gray-700 text-sm mb-2">
                      Technical: {data.skill_sets[0].technical_skills.map(s => s.value).join(", ")}
                    </p>
                  </div>
                )}
                {data.skill_sets[0].soft_skills.length > 0 && (
                  <div>
                    <p className="font-bold text-gray-700 text-sm mb-2">
                      Soft: {data.skill_sets[0].soft_skills.map(s => s.value).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
          
          {/* Languages */}
          {data.languages.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <p key={lang.id} className="text-gray-700 text-sm">
                    {lang.language} - {lang.proficiency}
                  </p>
                ))}
              </div>
            </section>
          )}
          
          {/* Certificates */}
          {data.profile.certificates.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                Certificates
              </h2>
              <div className="space-y-3">
                {data.profile.certificates.map((cert) => (
                  <div key={cert.id}>
                    <p className="text-gray-800 text-sm">
                      {cert.name} - {cert.issuer} ({formatDate(cert.date)})
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* References */}
          {data.references.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-blue-800 uppercase mb-4">
                References
              </h2>
              <div className="space-y-4">
                {data.references.map((ref) => (
                  <div key={ref.id}>
                    <p className="text-gray-800 text-sm">
                      {ref.name} | {ref.position} | {ref.email} | {ref.phone}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ModernTemplate;