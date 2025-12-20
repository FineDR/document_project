import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useCurrentUserCV } from "../../../hooks/useCurrentUserCV";

interface AdvancedTemplateProps {
  isPreview?: boolean; // optional prop
}

const IntermediateTemplate = ({ isPreview }: AdvancedTemplateProps) => {
  let user = useSelector((state: RootState) => state.auth.user);
  const { data: cvData } = useCurrentUserCV();
  user = cvData || user;
  const full_name = `${user?.personal_details?.first_name || ""} ${user?.personal_details?.middle_name || ""} ${user?.personal_details?.last_name || ""}`.trim();

  // --- Loading Skeleton ---
  if (!user && isPreview) {
    return (
      <div className="w-full max-w-[210mm] mx-auto space-y-4 p-4">
        {/* Header */}
        <div className="bg-gray-300 h-6 w-32 rounded animate-pulse mx-auto mb-2"></div>
        <div className="flex justify-center gap-2 mb-4">
          <div className="bg-gray-200 h-3 w-16 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-3 w-16 rounded animate-pulse"></div>
        </div>

        {/* Two-column preview blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-gray-200 h-3 w-3/4 rounded animate-pulse"></div>
            <div className="bg-gray-100 h-20 w-full rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-3 w-3/4 rounded animate-pulse"></div>
            <div className="bg-gray-100 h-20 w-full rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Main Container Responsive Logic:
    // 1. Mobile: Full width, auto height, flat shadow/border (looks like part of the app).
    // 2. Desktop (md): Fixed A4 width (210mm), min-height, centered, paper shadow.
    // 3. Print: Forces A4 dimensions, removes screen-only styles.
    <div className="
        bg-whiteBg bg-white 
        w-full md:w-[210mm] md:min-h-[297mm] h-auto 
        mx-auto 
        p-4 md:p-8 
        shadow-none md:shadow-lg 
        border-none md:border border-gray-300 
        rounded-none md:rounded-lg 
        overflow-visible font-sans
        print:w-[210mm] print:h-[297mm] print:shadow-none print:border-0 print:m-0 print:p-8 print:overflow-visible
    ">
      {user ? (
        <div className="space-y-6">

          {/* --- Header / Name --- */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full max-w-3xl mx-auto">
              {/* Profile Image */}
              {user?.personal_details?.profile_image && (
                <div className="mx-auto sm:mx-0 shrink-0">
                  <img
                    src={`${import.meta.env.VITE_APP_API_BASE_URL}${user?.personal_details?.profile_image}`}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover border-2 border-blue-700 block"
                    style={{ borderRadius: 0 }} // no rounding
                  />
                </div>
              )}

              {/* Name and Contact */}
              <div className="flex flex-col justify-center text-center sm:text-left w-full">
                {/* Full Name */}
                <h1
                  className="text-2xl sm:text-3xl font-bold uppercase text-blue-800 mb-2"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {full_name}
                </h1>

                {/* Contact Info */}
                <div
                  className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-blue-700 text-sm mt-1 leading-relaxed"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {user?.personal_details?.phone && <span>{user?.personal_details?.phone}</span>}
                  
                  {user?.email && <span className="hidden sm:inline">|</span>}
                  {user?.email && <span>{user.email}</span>}
                  
                  {user?.personal_details?.address && <span className="hidden sm:inline">|</span>}
                  {user?.personal_details?.address && <span>{user?.personal_details?.address}</span>}
                  
                  {user?.personal_details?.github && <span className="hidden sm:inline">|</span>}
                  {user?.personal_details?.github && <span>{user?.personal_details?.github}</span>}
                  
                  {user?.personal_details?.linkedin && <span className="hidden sm:inline">|</span>}
                  {user?.personal_details?.linkedin && <span>{user?.personal_details?.linkedin}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* --- Profile Summary --- */}
          {user?.personal_details?.profile_summary && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm print:bg-transparent print:shadow-none print:border print:border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 uppercase mb-2 border-b border-blue-600 pb-1">Profile Summary</h2>
              <p className="text-gray-700 text-sm text-justify leading-relaxed">{user?.personal_details?.profile_summary}</p>
            </div>
          )}

          {/* --- Education (Responsive Grid) --- */}
          {user?.educations && user.educations.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Education</h2>
              {/* grid-cols-1 on mobile, grid-cols-2 on sm/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.educations?.map((edu) => (
                  <div key={edu.id} className="p-4 bg-gray-50 rounded-lg shadow-sm print:shadow-none print:border print:border-gray-200">
                    <h3 className="text-gray-900 font-semibold">{edu?.degree}</h3>
                    <span className="text-gray-600 block mb-2">{edu?.institution}</span>
                    <div className="text-gray-500 text-sm space-y-0.5">
                      <div>{edu?.location}</div>
                      <div>{edu?.start_date} – {edu?.end_date}</div>
                      {edu?.grade && <div className="font-medium text-blue-600">Grade: {edu?.grade}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Work Experience (Responsive Grid) --- */}
          {user?.work_experiences && user.work_experiences.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Work Experience</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.work_experiences?.map((work) => (
                  <div key={work?.id} className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-2 print:shadow-none print:border print:border-gray-200">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-gray-900">{work?.job_title}</h3>
                      <span className="text-gray-600 text-sm italic">{work?.company}</span>
                    </div>
                    <div className="text-gray-500 text-sm flex justify-between border-b border-gray-200 pb-2 mb-1 last:border-0">
                      <span>{work?.location}</span>
                      <span>{work?.start_date} – {work?.end_date || "Present"}</span>
                    </div>
                    {work?.responsibilities?.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-gray-700 text-sm space-y-1">
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

          {/* --- Projects (Responsive Grid) --- */}
          {user?.projects && user.projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.projects?.map((proj) => (
                  <div key={proj?.id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col h-full print:shadow-none print:border print:border-gray-200">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{proj?.title}</h3>
                      <p className="text-gray-700 text-sm mt-1 leading-relaxed">{proj?.description}</p>
                      {proj?.link && (
                        <a href={proj?.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-1 block break-all">
                          {proj?.link}
                        </a>
                      )}
                    </div>
                    {proj?.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 text-xs text-blue-700">
                        {proj?.technologies?.map((tech) => (
                            <span key={tech?.id} className="bg-green-100 border border-green-300 text-green-700 px-2 py-1 rounded-full text-xs">{tech?.value}</span>
                        ))}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Skills (Responsive Grid) --- */}
          {user?.skill_sets && user.skill_sets.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.skill_sets?.map((skills) => (
                  <div key={skills?.id} className="space-y-3">
                    {skills?.technical_skills?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Technical Skills</h3>
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
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Soft Skills</h3>
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

          {/* --- Certifications & Achievements & Languages Mixed Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            {user?.profile?.certificates && user.profile.certificates.length > 0 && (
                <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Certifications</h2>
                <div className="space-y-2">
                    {user?.profile?.certificates?.map((cert) => (
                    <div key={cert?.id} className="p-3 bg-gray-50 rounded-lg shadow-sm print:shadow-none print:border print:border-gray-200">
                        <div className="font-medium text-gray-800">{cert?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{cert?.issuer || "N/A"}</div>
                        <div className="text-xs text-gray-400 mt-1">{cert?.date || "N/A"}</div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Achievements */}
            {user?.achievement_profile?.achievements && user.achievement_profile.achievements.length > 0 && (
                <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Achievements</h2>
                <div className="space-y-2">
                    {user?.achievement_profile?.achievements?.map((ac) => (
                    <div key={ac?.id} className="p-3 bg-gray-50 rounded-lg shadow-sm text-gray-700 text-sm print:shadow-none print:border print:border-gray-200">
                        {ac?.value || "N/A"}
                    </div>
                    ))}
                </div>
                </div>
            )}
          </div>

          {/* --- Languages & References --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Languages */}
              {user?.languages && user.languages.length > 0 && (
                <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">Languages</h2>
                <div className="space-y-2">
                    {user?.languages?.map((lang) => (
                    <div key={lang?.id} className="flex justify-between items-center bg-gray-50 p-2 rounded print:border print:border-gray-200">
                        <span className="font-medium text-gray-800 text-sm">{lang?.language}</span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{lang?.proficiency}</span>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* References */}
            {user?.references && user.references.length > 0 && (
                <div className="space-y-3">
                <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">References</h2>
                <div className="space-y-2">
                    {user?.references?.map((ref) => (
                    <div key={ref?.id} className="bg-gray-50 p-3 rounded-lg shadow-sm print:shadow-none print:border print:border-gray-200">
                        <div className="font-medium text-gray-800">{ref?.name}</div>
                        <div className="text-gray-600 text-xs">{ref?.position}</div>
                        <div className="text-blue-600 text-xs mt-1">{ref?.email}</div>
                        <div className="text-gray-500 text-xs">{ref?.phone}</div>
                    </div>
                    ))}
                </div>
                </div>
            )}
          </div>

        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[200px]">
             <p className="text-center text-gray-600">No user details found. Please fill CV details.</p>
        </div>
      )}
    </div>
  );
};

export default IntermediateTemplate;