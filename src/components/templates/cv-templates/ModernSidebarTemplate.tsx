import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useCurrentUserCV } from "../../../hooks/useCurrentUserCV";

interface TemplateProps {
    isPreview?: boolean;
}

const ModernSidebarTemplate = ({ isPreview }: TemplateProps) => {
    let user = useSelector((state: RootState) => state.auth.user);
    const { data: cvData } = useCurrentUserCV();
    user = cvData || user;

    const full_name = `${user?.personal_details?.first_name || ""} ${user?.personal_details?.middle_name || ""} ${user?.personal_details?.last_name || ""}`.trim();

    // --- Skeleton Loader for Preview ---
    if (!user && isPreview) {
        return (
            <div className="flex flex-col md:flex-row w-full h-full bg-white shadow-lg">
                {/* Left Sidebar Skeleton */}
                <div className="w-full md:w-[32%] bg-slate-900 p-6 space-y-6">
                    <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto animate-pulse"></div>
                    <div className="space-y-3 mt-4 md:mt-8">
                        <div className="h-2 w-full bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-2 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-2 w-5/6 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Right Content Skeleton */}
                <div className="w-full md:w-[68%] p-6 md:p-8 space-y-6">
                    <div className="space-y-2 mb-8">
                        <div className="h-8 md:h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                    </div>

                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-24 w-full bg-gray-50 border border-gray-100 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        // Main Container
        <div className="
        bg-white 
        w-full md:w-[210mm] md:min-h-[297mm] h-auto
        mx-auto 
        shadow-none md:shadow-2xl 
        border-none md:border border-gray-200
        flex flex-col md:flex-row
        font-sans text-sm 
        overflow-hidden
        print:w-[210mm] print:h-[297mm] print:flex-row print:shadow-none print:border-0 print:m-0 print:overflow-visible
    ">

            {/* 
        ========================
        MOBILE-ONLY HEADER 
        Display Name & Title at the very top for Mobile View.
        Hidden on Desktop (md) and Print.
        ======================== 
      */}
            <div className="p-6 pb-2 bg-white block md:hidden print:hidden">
                <h1 className="text-3xl font-bold text-redMain uppercase tracking-tight leading-none break-words text-left">
                    {user?.personal_details?.first_name} <span className="text-text">{user?.personal_details?.last_name}</span>
                </h1>
                <p className="text-subHeadingGray mt-2 text-base font-medium tracking-wide opacity-80 text-left">
                    Professional Resume
                </p>
            </div>

            {/* =======================
          LEFT SIDEBAR (Dark)
          Contains Image, Contact, Skills
      ======================== */}
            <div className="
        w-full md:w-[32%] 
        bg-slate-900 text-white 
        p-6 md:p-8 
        flex flex-col gap-6 md:gap-8 
        shrink-0 
        print:w-[32%] print:bg-slate-900 print:text-white print:h-full
      ">

                {/* Profile Image */}
                <div className="flex flex-col items-center">
                    {user?.personal_details?.profile_image ? (
                        <img
                            src={`${import.meta.env.VITE_APP_API_BASE_URL}${user?.personal_details?.profile_image}`}
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-700 shadow-xl"
                        />
                    ) : (
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-500 border-4 border-slate-700">
                            {full_name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-redMain font-bold uppercase tracking-widest border-b border-slate-700 pb-2 mb-2 text-xs">Contact</h3>

                    <div className="space-y-3 text-sm text-slate-300">
                        {user?.email && (
                            <div className="break-all md:break-words">
                                <span className="block text-[10px] uppercase text-slate-500 font-bold">Email</span>
                                {user.email}
                            </div>
                        )}
                        {user?.personal_details?.phone && (
                            <div>
                                <span className="block text-[10px] uppercase text-slate-500 font-bold">Phone</span>
                                {user?.personal_details?.phone}
                            </div>
                        )}
                        {user?.personal_details?.address && (
                            <div>
                                <span className="block text-[10px] uppercase text-slate-500 font-bold">Address</span>
                                {user?.personal_details?.address}
                            </div>
                        )}
                        {user?.personal_details?.linkedin && (
                            <div className="break-words">
                                <span className="block text-[10px] uppercase text-slate-500 font-bold">LinkedIn</span>
                                <a href={user?.personal_details?.linkedin} target="_blank" className="hover:text-redMain transition duration-300">Profile Link ↗</a>
                            </div>
                        )}
                        {user?.personal_details?.github && (
                            <div className="break-words">
                                <span className="block text-[10px] uppercase text-slate-500 font-bold">GitHub</span>
                                <a href={user?.personal_details?.github} target="_blank" className="hover:text-redMain transition duration-300">Portfolio Link ↗</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills (Sidebar) */}
                {user?.skill_sets && user.skill_sets.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-redMain font-bold uppercase tracking-widest border-b border-slate-700 pb-2 mb-2 text-xs">Skills</h3>
                        {user.skill_sets.map((skillGroup) => (
                            <div key={skillGroup.id} className="mb-4 last:mb-0">
                                {skillGroup.technical_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {skillGroup.technical_skills.map(t => (
                                            <span key={t.id} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded shadow-sm border border-slate-700">
                                                {t.value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {skillGroup.soft_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {skillGroup.soft_skills.map(s => (
                                            <span key={s.id} className="bg-slate-800/50 text-slate-400 text-xs px-2 py-1 rounded border border-slate-700/50">
                                                {s.value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Languages */}
                {user?.languages && user.languages.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-redMain font-bold uppercase tracking-widest border-b border-slate-700 pb-2 mb-2 text-xs">Languages</h3>
                        <ul className="space-y-2">
                            {user.languages.map(lang => (
                                <li key={lang.id} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-200">{lang.language}</span>
                                    <span className="text-xs text-slate-500 italic bg-slate-800 px-2 py-0.5 rounded-full">{lang.proficiency}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>


            {/* =======================
          RIGHT CONTENT (White)
          Contains Experience, Projects, Education
      ======================== */}
            <div className="
        w-full md:w-[68%] 
        p-6 md:p-8 
        bg-white 
        flex flex-col gap-6 
        print:w-[68%]
      ">

                {/* 
            DESKTOP-ONLY HEADER 
            Visible only on Desktop (md) and Print.
            Hidden on Mobile.
        */}
                <div className="border-b-4 border-gray-100 pb-6 hidden md:block print:block">
                    <h1 className="text-3xl md:text-5xl font-bold text-redMain uppercase tracking-tight leading-none break-words">
                        {user?.personal_details?.first_name} <span className="text-text">{user?.personal_details?.last_name}</span>
                    </h1>
                    <p className="text-subHeadingGray mt-2 text-base md:text-lg font-medium tracking-wide opacity-80">
                        Professional Resume
                    </p>
                </div>

                {/* Profile Summary */}
                {user?.personal_details?.profile_summary && (
                    <div>
                        <h2 className="text-lg font-bold text-text uppercase tracking-widest mb-3 flex items-center gap-3">
                            <span className="w-8 h-1 bg-redMain rounded-full"></span>
                            Profile
                        </h2>
                        <p className="text-subHeadingGray text-sm md:text-base leading-relaxed text-justify bg-gray-50 p-4 rounded-r-xl border-l-4 border-redMain/20">
                            {user.personal_details.profile_summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {user?.work_experiences && user.work_experiences.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-text uppercase tracking-widest mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-redMain rounded-full"></span>
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {user.work_experiences.map((work) => (
                                <div key={work.id} className="relative pl-6 border-l-2 border-redMain/30 hover:border-redMain transition-colors duration-300">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-redMain"></div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                        <h3 className="text-base font-bold text-text">{work.job_title}</h3>
                                        <span className="text-xs font-bold text-redMain bg-redMain/5 px-2 py-1 rounded-full whitespace-nowrap mt-1 sm:mt-0 w-fit">
                                            {work.start_date} - {work.end_date || 'Present'}
                                        </span>
                                    </div>

                                    <div className="text-sm font-semibold text-subHeadingGray mb-3">
                                        {work.company} • <span className="italic font-normal">{work.location}</span>
                                    </div>

                                    {work.responsibilities && work.responsibilities.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 text-subHeadingGray text-sm space-y-1 marker:text-redMain/50">
                                            {work.responsibilities.map((resp, i) => (
                                                <li key={i} className="pl-1">{resp.value}</li>
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
                    <div>
                        <h2 className="text-lg font-bold text-text uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-redMain rounded-full"></span>
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {user.projects.map((proj) => (
                                <div key={proj.id} className="group bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                        <h3 className="font-bold text-text group-hover:text-redMain transition-colors">{proj.title}</h3>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-redMain font-semibold hover:underline bg-redMain/5 px-2 py-1 rounded whitespace-nowrap">
                                                View Project ↗
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm text-subHeadingGray mb-3 leading-relaxed">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {proj.technologies.map(tech => (
                                            <span key={tech.id} className="text-[10px] uppercase font-bold text-subHeadingGray bg-gray-100 px-2 py-1 rounded">
                                                {tech.value}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {user?.educations && user.educations.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-text uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-redMain rounded-full"></span>
                            Education
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {user.educations.map((edu) => (
                                <div key={edu.id} className="flex flex-col p-3 bg-gray-50/50 rounded-lg border-l-4 border-gray-300">
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-text">{edu.degree}</h3>
                                            <div className="text-sm text-subHeadingGray">{edu.institution}</div>
                                        </div>
                                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                                            <div className="text-xs font-bold text-redMain">{edu.start_date} - {edu.end_date}</div>
                                            {edu.grade && <div className="text-xs text-gray-400 mt-1">Grade: {edu.grade}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* References / Certifications */}
                {user?.profile?.certificates && user.profile.certificates.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-text uppercase tracking-widest mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-redMain rounded-full"></span>
                            Certifications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user.profile.certificates.map(cert => (
                                <div key={cert.id} className="border border-gray-100 p-3 rounded bg-white shadow-sm">
                                    <div className="font-bold text-text text-sm">{cert.name}</div>
                                    <div className="text-xs text-redMain font-semibold mt-1">{cert.issuer}</div>
                                    {cert.date && <div className="text-[10px] text-gray-400 mt-1">{cert.date}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ModernSidebarTemplate;