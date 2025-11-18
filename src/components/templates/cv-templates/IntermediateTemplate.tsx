import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface AdvancedTemplateProps {
  isPreview?: boolean; // optional prop
}

const IntermediateTemplate = ({ isPreview }: AdvancedTemplateProps) => {
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
    <div className="bg-whiteBg w-[210mm] h-[297mm] max-w-full max-h-[90vh] mx-auto p-6 shadow-lg border border-gray-300 rounded-lg overflow-auto font-sans">
      {user ? (
        <div className="space-y-6">

          {/* --- Header / Name --- */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full max-w-2xl mx-auto">
              {/* Profile Image */}
              {user?.personal_details?.profile_image && (
                <img
                  src={`${import.meta.env.VITE_APP_API_BASE_URL}${user?.personal_details?.profile_image}`}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover border-2 border-blue-700"
                  style={{ borderRadius: 0 }} // no rounding
                />
              )}

              {/* Name and Contact */}
              <div className="flex flex-col justify-center text-center sm:text-left">
                {/* Full Name */}
                <h1
                  className="text-3xl font-bold uppercase text-blue-800 mb-1"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {user?.profile?.full_name || "Full Name"}
                </h1>

                {/* Contact Info */}
                <div
                  className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-blue-700 text-sm mt-1"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {user?.personal_details?.phone && <span>{user?.personal_details?.phone}</span>}
                  {user?.email && <span>| {user.email}</span>}
                  {user?.personal_details?.address && <span>| {user?.personal_details?.address}</span>}
                  {user?.personal_details?.github && <span>| {user?.personal_details?.github}</span>}
                  {user?.personal_details?.linkedin && <span>| {user?.personal_details?.linkedin}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* --- Profile Summary - Only show if data exists --- */}
          {user?.personal_details?.profile_summary && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 uppercase mb-2 border-b border-blue-600 pb-1">Profile Summary</h2>
              <p className="text-gray-700 text-sm text-justify">{user?.personal_details?.profile_summary}</p>
            </div>
          )}

          {/* --- Education (2 columns) - Only show if data exists --- */}
          {user?.educations && user.educations.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Education</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {user?.educations?.map((edu) => (
                  <div key={edu.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <h3 className="text-gray-900 font-semibold">{edu?.degree}</h3>
                    <span className="text-gray-600">{edu?.institution}</span>
                    <div className="text-gray-500 text-sm mt-1">
                      <div>{edu?.location}</div>
                      <div>{edu?.start_date} – {edu?.end_date}</div>
                      <div>Grade: {edu?.grade}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Work Experience (2 columns) - Only show if data exists --- */}
          {user?.work_experiences && user.work_experiences.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Work Experience</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {user?.work_experiences?.map((work) => (
                  <div key={work?.id} className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">{work?.job_title}</h3>
                      <span className="text-gray-600 text-sm italic">{work?.company}</span>
                    </div>
                    <div className="text-gray-500 text-sm flex justify-between mt-1">
                      <span>{work?.location}</span>
                      <span>{work?.start_date} – {work?.end_date || "Present"}</span>
                    </div>
                    {work?.responsibilities?.length > 0 && (
                      <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                        {work?.responsibilities?.map((resp, i) => (
                          <li key={i}>{resp?.value}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Projects (2 columns) - Only show if data exists --- */}
          {user?.projects && user.projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Projects</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {user?.projects?.map((proj) => (
                  <div key={proj?.id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{proj?.title}</h3>
                      <p className="text-gray-700 text-sm mt-1">{proj?.description}</p>
                      {proj?.link && (
                        <a href={proj?.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-1 block">
                          {proj?.link}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 text-xs text-blue-700">
                      {proj?.technologies?.map((tech) => (
                        <span key={tech?.id} className="bg-green-100 border border-green-300 text-green-700 px-2 py-1 rounded-full text-xs">{tech?.value}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Skills (2 columns) - Only show if data exists --- */}
          {user?.skill_sets && user.skill_sets.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Skills</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {user?.skill_sets?.map((skills) => (
                  <div key={skills?.id} className="space-y-2">
                    {skills?.technical_skills?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills?.technical_skills?.map((tech) => (
                            <span
                              key={tech?.id}
                              className="bg-blue-100 border border-blue-300 text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              {tech?.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {skills?.soft_skills?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Soft Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills?.soft_skills?.map((soft) => (
                            <span
                              key={soft?.id}
                              className="bg-green-100 border border-green-300 text-green-700 px-2 py-1 rounded-full text-xs"
                            >
                              {soft?.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Certifications - Only show if data exists --- */}
          {user?.profile?.certificates && user.profile.certificates.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Certifications</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {user?.profile?.certificates?.map((cert) => (
                  <div key={cert?.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="font-medium text-gray-800">{cert?.name || "N/A"}</div>
                    <div className="text-sm text-gray-500">{cert?.issuer || "N/A"}</div>
                    <div className="text-sm text-gray-400">{cert?.date || "N/A"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Achievements - Only show if data exists --- */}
          {user?.achievement_profile?.achievements && user.achievement_profile.achievements.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Achievements</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {user?.achievement_profile?.achievements?.map((ac) => (
                  <div key={ac?.id} className="p-4 bg-gray-50 rounded-lg shadow-sm text-gray-700 text-sm">
                    {ac?.value || "N/A"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Languages - Only show if data exists --- */}
          {user?.languages && user.languages.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Languages</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {user?.languages?.map((lang) => (
                  <div key={lang?.id} className="flex justify-between text-gray-700 text-sm">
                    <span>{lang?.language}</span>
                    <span className="italic text-gray-500">{lang?.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- References - Only show if data exists --- */}
          {user?.references && user.references.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">References</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {user?.references?.map((ref) => (
                  <div key={ref?.id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <div className="font-medium text-gray-800">{ref?.name}</div>
                    <div className="text-gray-600 text-sm">{ref?.position}</div>
                    <div className="text-gray-600 text-sm">{ref?.email}</div>
                    <div className="text-gray-600 text-sm">{ref?.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <p className="text-center text-gray-600">No user details found. Please fill CV details.</p>
      )}
    </div>
  );
};

export default IntermediateTemplate;