import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
    interface AdvancedTemplateProps {
  isPreview?: boolean; // optional prop
}
const AdvancedTemplate = ({ isPreview }: AdvancedTemplateProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user && isPreview) {
    return (
      <div className="space-y-2 p-2">
        {/* Header */}
        <div className="bg-gray-300 h-4 w-32 rounded animate-pulse mx-auto mb-2"></div>
        <div className="flex justify-center gap-2 mb-2">
          <div className="bg-gray-200 h-3 w-16 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-3 w-16 rounded animate-pulse"></div>
        </div>

        {/* Two-column preview blocks */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="bg-gray-200 h-3 w-full rounded animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-full rounded animate-pulse"></div>
          </div>
          <div className="space-y-1">
            <div className="bg-gray-200 h-3 w-full rounded animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-full rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white w-[210mm] h-[297mm] max-w-full max-h-[90vh] mx-auto p-6 shadow-xl border border-gray-300 rounded-lg overflow-auto font-sans">
      {user ? (
        <div className="space-y-6">

          {/* --- Header / Name & Role --- */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold uppercase text-gray-900">{user.profile.full_name}</h1>
            <div className="flex flex-wrap justify-center items-center text-sm text-gray-600 gap-x-3 gap-y-1 mt-1">
              <span>{user.personal_details.phone}</span>
              <span className="text-blue-600 font-semibold">|</span>
              <span>{user.email}</span>
              <span className="text-blue-600 font-semibold">|</span>
              <span>{user.personal_details.address}</span>
            </div>
            <div className="flex justify-center flex-wrap gap-3 mt-1 text-blue-600 text-sm">
              <a href={user.personal_details.github} target="_blank" className="underline">{user.personal_details.github}</a>
              <a href={user.personal_details.linkedin} target="_blank" className="underline">{user.personal_details.linkedin}</a>
            </div>
          </div>

          {/* --- Two Column Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column */}
            <div className="space-y-6">

              {/* Profile Summary */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-blue-800 mb-2 border-b border-blue-300 pb-1">Profile Summary</h2>
                <p className="text-gray-700 text-sm text-justify">{user.personal_details.profile_summary}</p>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Education</h2>
                <div className="space-y-2">
                  {user.educations.map((edu) => (
                    <div key={edu.id} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-400">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <span className="text-gray-600">{edu.institution}</span>
                      <div className="text-gray-500 text-sm mt-1">
                        <div>{edu.location}</div>
                        <div>{edu.start_date} – {edu.end_date}</div>
                        <div>Grade: {edu.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Languages</h2>
                <div className="flex flex-wrap gap-3">
                  {user.languages.map((lang) => (
                    <span key={lang.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {lang.language} ({lang.proficiency})
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Work Experience */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Work Experience</h2>
                {user.work_experiences.map((work) => (
                  <div key={work.id} className="p-4 bg-gray-50 rounded-lg shadow-md border-l-4 border-green-400 space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">{work.job_title}</h3>
                      <span className="text-gray-600 text-sm italic">{work.company}</span>
                    </div>
                    <div className="text-gray-500 text-sm flex justify-between mt-1">
                      <span>{work.location}</span>
                      <span>{work.start_date} – {work.end_date || "Present"}</span>
                    </div>
                    {work.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                        {work.responsibilities.map((resp, i) => (
                          <li key={i}>{resp.value}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Projects</h2>
                {user.projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-gray-50 rounded-lg shadow-md space-y-2">
                    <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                    <p className="text-gray-700 text-sm">{proj.description}</p>
                    {proj.link && (
                      <a href={proj.link} target="_blank" className="text-blue-600 underline text-sm block">{proj.link}</a>
                    )}
                    <div className="flex flex-wrap gap-1 text-xs text-blue-700">
                      {proj.technologies.map((tech) => (
                        <span key={tech.id} className="bg-blue-100 px-2 py-1 rounded-full">{tech.value}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Skills</h2>
                {user.skill_sets.map((skills) => (
                  <div key={skills.id} className="space-y-2">
                    {skills.technical_skills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.technical_skills.map((tech) => (
                            <span key={tech.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{tech.value}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {skills.soft_skills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Soft Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.soft_skills.map((soft) => (
                            <span key={soft.id} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">{soft.value}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* --- References --- */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">References</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {user.references.length > 0 ? (
                user.references.map((ref) => (
                  <div key={ref.id} className="bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 border-purple-400">
                    <div className="font-medium text-gray-800">{ref.name}</div>
                    <div className="text-gray-600 text-sm">{ref.position}</div>
                    <div className="text-gray-600 text-sm">{ref.email}</div>
                    <div className="text-gray-600 text-sm">{ref.phone}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm col-span-2">No references added yet.</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        <p className="text-center text-gray-600">No user details found. Please fill CV details.</p>
      )}
    </div>
  );
};

export default AdvancedTemplate;
