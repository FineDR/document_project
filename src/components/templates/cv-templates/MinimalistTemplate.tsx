import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useCurrentUserCV } from "../../../hooks/useCurrentUserCV";

interface TemplateProps {
  isPreview?: boolean;
}

const MinimalistTemplate = ({ isPreview }: TemplateProps) => {
    let user = useSelector((state: RootState) => state.auth.user);
    const { data: cvData } = useCurrentUserCV();
    user = cvData || user;
  
  const full_name = `${user?.personal_details?.first_name || ""} ${user?.personal_details?.middle_name || ""} ${user?.personal_details?.last_name || ""}`.trim();

  // --- Skeleton Loader ---
  if (!user && isPreview) {
    return (
      <div className="bg-white w-full md:w-[210mm] mx-auto h-full flex flex-col p-4 md:p-8 space-y-8 shadow-lg">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center space-y-4 border-b pb-8 border-gray-100">
           <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
           <div className="h-8 w-3/4 md:w-1/2 bg-gray-300 rounded animate-pulse"></div>
           <div className="h-4 w-1/2 md:w-1/3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 gap-8">
            <div className="w-full md:w-[60%] space-y-8">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-20 w-full bg-gray-50 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
            <div className="w-full md:w-[40%] space-y-8 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    // MAIN CONTAINER
    // Mobile: w-full, h-auto, flex-col (Stack)
    // Desktop: w-[210mm], h-[297mm] (A4 Fixed), shadow
    // Print: Enforce A4 dimensions
    <div className="
        bg-white 
        w-full md:w-[210mm] md:h-[297mm] h-auto
        mx-auto 
        shadow-none md:shadow-2xl 
        overflow-visible md:overflow-hidden 
        flex flex-col 
        font-sans text-sm relative
        print:w-[210mm] print:h-[297mm] print:shadow-none print:overflow-hidden print:m-0
    ">
      
      {/* Decorative Top Border */}
      <div className="w-full h-2 bg-redMain shrink-0"></div>

      {/* =======================
          HEADER SECTION
      ======================== */}
      <div className="px-6 py-8 md:px-10 md:pt-10 md:pb-8 flex flex-col items-center border-b border-gray-200 shrink-0">
         {/* Profile Image */}
         {user?.personal_details?.profile_image && (
            <img
                src={`${import.meta.env.VITE_APP_API_BASE_URL}${user?.personal_details?.profile_image}`}
                alt="Profile"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg mb-4"
            />
         )}

         {/* Name */}
         <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-text text-center leading-tight break-words max-w-full">
            {full_name}
         </h1>

         {/* Contact Grid */}
         <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-2 mt-4 text-xs text-subHeadingGray font-medium">
             {user?.email && (
                 <span className="flex items-center gap-1">
                    ✉️ <span className="break-all">{user.email}</span>
                 </span>
             )}
             {user?.personal_details?.phone && (
                 <span className="flex items-center gap-1">
                    📞 {user.personal_details.phone}
                 </span>
             )}
             {user?.personal_details?.address && (
                 <span className="flex items-center gap-1 text-center">
                    📍 {user.personal_details.address}
                 </span>
             )}
             {user?.personal_details?.linkedin && (
                 <a href={user.personal_details.linkedin} target="_blank" rel="noopener noreferrer" className="text-redMain hover:underline">
                    LinkedIn
                 </a>
             )}
              {user?.personal_details?.github && (
                 <a href={user.personal_details.github} target="_blank" rel="noopener noreferrer" className="text-redMain hover:underline">
                    GitHub
                 </a>
             )}
         </div>
      </div>

      {/* =======================
          MAIN BODY SPLIT
          Mobile: flex-col (Stack vertically)
          Desktop: flex-row (Side by Side)
      ======================== */}
      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden print:flex-row print:overflow-hidden">
          
          {/* --- LEFT COLUMN (Main Content) --- 
              Mobile: w-full, auto height
              Desktop: w-[65%], scrollable if content overflows
          */}
          <div className="
            w-full md:w-[65%] 
            h-auto md:h-full 
            p-6 md:p-10 
            overflow-visible md:overflow-y-auto 
            md:pr-8 
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            print:w-[65%] print:h-full print:overflow-visible
          ">
              
              {/* Profile Summary */}
              {user?.personal_details?.profile_summary && (
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-redMain uppercase tracking-widest mb-3 border-b-2 border-redMain inline-block pb-1">
                        Professional Profile
                    </h2>
                    <p className="text-subHeadingGray leading-relaxed text-justify mt-2">
                        {user.personal_details.profile_summary}
                    </p>
                </div>
              )}

              {/* Work Experience */}
              {user?.work_experiences && user.work_experiences.length > 0 && (
                  <div className="mb-8">
                      <h2 className="text-sm font-bold text-redMain uppercase tracking-widest mb-6 border-b-2 border-redMain inline-block pb-1">
                          Work Experience
                      </h2>
                      <div className="space-y-6">
                          {user.work_experiences.map((work) => (
                              <div key={work.id}>
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                      <h3 className="text-base font-bold text-text">{work.job_title}</h3>
                                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded w-fit mt-1 sm:mt-0">
                                          {work.start_date} - {work.end_date || 'Present'}
                                      </span>
                                  </div>
                                  <div className="text-sm text-redMain font-medium mb-2">{work.company}, {work.location}</div>
                                  
                                  {work.responsibilities && work.responsibilities.length > 0 && (
                                      <ul className="list-disc ml-4 text-subHeadingGray text-sm space-y-1">
                                          {work.responsibilities.map((resp, i) => (
                                              <li key={i}>{resp.value}</li>
                                          ))}
                                      </ul>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Projects */}
              {user?.projects && user.projects.length > 0 && (
                  <div className="mb-8">
                      <h2 className="text-sm font-bold text-redMain uppercase tracking-widest mb-6 border-b-2 border-redMain inline-block pb-1">
                          Key Projects
                      </h2>
                      <div className="space-y-5">
                          {user.projects.map((proj) => (
                              <div key={proj.id} className="pb-4 border-b border-gray-100 last:border-0">
                                  <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-bold text-text">{proj.title}</h3>
                                      {proj.link && (
                                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white bg-redMain px-1.5 rounded hover:bg-red-700 transition">
                                              Link
                                          </a>
                                      )}
                                  </div>
                                  <p className="text-sm text-subHeadingGray mb-2">{proj.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 font-mono">
                                      {proj.technologies.map(t => (
                                          <span key={t.id}>#{t.value}</span>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Achievements */}
              {user?.achievement_profile?.achievements && user.achievement_profile.achievements.length > 0 && (
                <div className="mb-8">
                   <h2 className="text-sm font-bold text-redMain uppercase tracking-widest mb-3 border-b-2 border-redMain inline-block pb-1">
                        Achievements
                    </h2>
                    <ul className="list-disc ml-4 text-subHeadingGray text-sm space-y-2 mt-2">
                        {user.achievement_profile.achievements.map((ac) => (
                            <li key={ac.id}>
                                {ac.value}
                            </li>
                        ))}
                    </ul>
                </div>
              )}
          </div>

          {/* --- RIGHT COLUMN (Sidebar) --- 
              Mobile: w-full, gray background, border-top
              Desktop: w-[35%], border-left
          */}
          <div className="
            w-full md:w-[35%] 
            h-auto md:h-full 
            bg-gray-50 
            p-6 md:p-8 
            border-t md:border-t-0 md:border-l border-gray-200 
            overflow-visible md:overflow-y-auto 
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            print:w-[35%] print:h-full print:border-l print:border-t-0 print:overflow-visible
          ">
              
              {/* Education */}
              {user?.educations && user.educations.length > 0 && (
                  <div className="mb-8">
                      <h2 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
                          Education
                      </h2>
                      <div className="space-y-4">
                          {user.educations.map((edu) => (
                              <div key={edu.id} className="flex flex-col">
                                  <span className="font-bold text-redMain text-sm">{edu.degree}</span>
                                  <span className="text-sm text-text font-medium">{edu.institution}</span>
                                  <span className="text-xs text-subHeadingGray mt-1">
                                      {edu.start_date} - {edu.end_date}
                                  </span>
                                  {edu.grade && <span className="text-xs text-gray-400 mt-0.5">Grade: {edu.grade}</span>}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Skills */}
              {user?.skill_sets && user.skill_sets.length > 0 && (
                  <div className="mb-8">
                      <h2 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
                          Skills
                      </h2>
                      {user.skill_sets.map((skillGroup) => (
                          <div key={skillGroup.id} className="mb-4">
                              {/* Tech Skills */}
                              {skillGroup.technical_skills.length > 0 && (
                                  <div className="flex flex-col gap-2 mb-3">
                                      <span className="text-xs font-semibold text-gray-500 uppercase">Technical</span>
                                      {skillGroup.technical_skills.map(t => (
                                          <div key={t.id} className="relative">
                                              <span className="text-sm text-subHeadingGray block bg-white border border-gray-200 px-3 py-1.5 rounded">
                                                  {t.value}
                                              </span>
                                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-redMain rounded-l"></div>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              {/* Soft Skills */}
                              {skillGroup.soft_skills.length > 0 && (
                                  <div className="flex flex-col gap-1">
                                      <span className="text-xs font-semibold text-gray-500 uppercase mb-1">Soft Skills</span>
                                      <div className="flex flex-wrap gap-2">
                                        {skillGroup.soft_skills.map(s => (
                                            <span key={s.id} className="text-xs text-subHeadingGray bg-white border border-gray-100 px-2 py-1 rounded">
                                                {s.value}
                                            </span>
                                        ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              )}

              {/* Languages */}
              {user?.languages && user.languages.length > 0 && (
                  <div className="mb-8">
                      <h2 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
                          Languages
                      </h2>
                      <ul className="space-y-2">
                          {user.languages.map((lang) => (
                              <li key={lang.id} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-0">
                                  <span className="text-sm font-medium text-subHeadingGray">{lang.language}</span>
                                  <span className="text-xs text-redMain font-bold">{lang.proficiency}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}

              {/* Certifications */}
              {user?.profile?.certificates && user.profile.certificates.length > 0 && (
                  <div className="mb-8">
                      <h2 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
                          Certifications
                      </h2>
                      <div className="space-y-3">
                          {user.profile.certificates.map(cert => (
                              <div key={cert.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                  <div className="text-sm font-bold text-gray-700 leading-tight">{cert.name}</div>
                                  <div className="text-xs text-redMain mt-1">{cert.issuer}</div>
                                  <div className="text-[10px] text-gray-400 mt-1">{cert.date}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* References */}
               {user?.references && user.references.length > 0 && (
                  <div>
                      <h2 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
                          References
                      </h2>
                      <div className="space-y-4">
                          {user.references.map(ref => (
                              <div key={ref.id} className="text-sm bg-white p-3 rounded border border-gray-100">
                                  <div className="font-bold text-text">{ref.name}</div>
                                  <div className="text-xs text-subHeadingGray font-medium">{ref.position}</div>
                                  <div className="text-xs text-gray-400 mt-1 flex flex-col gap-0.5">
                                      <span>{ref.email}</span>
                                      <span>{ref.phone}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};

export default MinimalistTemplate;