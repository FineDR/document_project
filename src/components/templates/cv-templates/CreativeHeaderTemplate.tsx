import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useCurrentUserCV } from "../../../hooks/useCurrentUserCV";
interface TemplateProps {
    isPreview?: boolean;
}

const CreativeHeaderTemplate = ({ isPreview }: TemplateProps) => {
    let user = useSelector((state: RootState) => state.auth.user);

    const { data: cvData } = useCurrentUserCV();
    user = cvData || user;
    const full_name = `${user?.personal_details?.first_name || ""} ${user?.personal_details?.middle_name || ""} ${user?.personal_details?.last_name || ""}`.trim();

    // --- Skeleton Loader ---
    if (!user && isPreview) {
        return (
            <div className="bg-white w-full h-full flex flex-col md:w-[210mm] mx-auto shadow-lg">
                {/* Header Skeleton */}
                <div className="h-40 bg-slate-800 w-full relative">
                    <div className="absolute -bottom-8 left-6 md:-bottom-10 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-lg border-4 border-white animate-pulse"></div>
                </div>

                <div className="mt-16 px-6 md:px-10 flex flex-col md:grid md:grid-cols-12 gap-8 h-full">
                    {/* Left Sidebar Skeleton */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-32 w-full bg-gray-100 rounded animate-pulse mt-8"></div>
                    </div>

                    {/* Right Content Skeleton */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-6"></div>
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-24 w-full bg-gray-50 border border-gray-100 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // Main Container
        // Mobile: w-full, h-auto, flex-col
        // Desktop: w-[210mm], min-h-[297mm]
        // Print: Enforce A4
        <div className="
        bg-white 
        w-full md:w-[210mm] md:min-h-[297mm] h-auto
        mx-auto 
        shadow-none md:shadow-2xl 
        border-none md:border border-gray-200
        overflow-visible flex flex-col 
        font-sans text-sm relative
        print:w-[210mm] print:h-[297mm] print:shadow-none print:border-0 print:m-0 print:overflow-visible
    ">

            {/* =======================
          COLORED HEADER BLOCK
      ======================== */}
            <div className="w-full bg-slate-900 text-white pt-10 pb-16 px-6 md:px-10 relative print:bg-slate-900 print:text-white">
                {/* Name Container - Pushed right to avoid image overlap */}
                <div className="ml-24 md:ml-36 pl-2 md:pl-4">
                    <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wider leading-none break-words">
                        {user?.personal_details?.first_name}
                        <span className="text-redMain block mt-1">{user?.personal_details?.last_name}</span>
                    </h1>
                </div>

                {/* Profile Image - Overlapping Absolute Position */}
                {user?.personal_details?.profile_image ? (
                    <div className="absolute -bottom-10 left-6 md:-bottom-12 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-white p-1 rounded-lg shadow-lg">
                        <img
                            src={`${import.meta.env.VITE_APP_API_BASE_URL}${user?.personal_details?.profile_image}`}
                            alt="Profile"
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                ) : (
                    <div className="absolute -bottom-10 left-6 md:-bottom-12 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-white p-1 rounded-lg shadow-lg flex items-center justify-center text-3xl md:text-4xl font-bold text-slate-900">
                        {full_name.charAt(0)}
                    </div>
                )}
            </div>

            {/* =======================
          BODY CONTENT
      ======================== */}
            <div className="flex flex-col md:flex-row flex-1 mt-12 md:mt-14">

                {/* --- LEFT COLUMN (Sidebar style) --- */}
                <div className="w-full md:w-[35%] px-6 md:pl-10 md:pr-6 pb-6 md:pb-10 space-y-8 order-2 md:order-1">

                    {/* Contact Info */}
                    {/* Added mt-8 on mobile only to give space if image pushes down */}
                    <div className="bg-gray-50 p-4 rounded border-l-4 border-redMain mt-4 md:mt-0">
                        <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs mb-3">Contact</h3>
                        <div className="space-y-2 text-xs text-subHeadingGray font-medium">
                            {user?.email && <div className="break-all">✉️ {user.email}</div>}
                            {user?.personal_details?.phone && <div>📞 {user.personal_details.phone}</div>}
                            {user?.personal_details?.address && <div>📍 {user.personal_details.address}</div>}
                            {user?.personal_details?.linkedin && (
                                <a href={user.personal_details.linkedin} target="_blank" rel="noopener noreferrer" className="block text-redMain hover:underline truncate">
                                    🔗 LinkedIn Profile
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    {user?.educations && user.educations.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-1">
                                Education
                            </h3>
                            <div className="space-y-4">
                                {user.educations.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-redMain text-sm">{edu.degree}</div>
                                        <div className="text-sm text-slate-700">{edu.institution}</div>
                                        <div className="text-xs text-gray-500 mt-1">{edu.start_date} - {edu.end_date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {user?.skill_sets && user.skill_sets.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-1">
                                Expertise
                            </h3>
                            {user.skill_sets.map((skillGroup) => (
                                <div key={skillGroup.id} className="mb-4">
                                    {skillGroup.technical_skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {skillGroup.technical_skills.map(t => (
                                                <span key={t.id} className="text-xs font-semibold bg-slate-800 text-white px-2 py-1 rounded">
                                                    {t.value}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {skillGroup.soft_skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {skillGroup.soft_skills.map(s => (
                                                <span key={s.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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
                        <div>
                            <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-1">
                                Languages
                            </h3>
                            <ul className="space-y-2">
                                {user.languages.map((lang) => (
                                    <li key={lang.id} className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-700">{lang.language}</span>
                                        <span className="bg-redMain/10 text-redMain px-2 py-0.5 rounded-full">{lang.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>


                {/* --- RIGHT COLUMN (Main Content) --- */}
                <div className="w-full md:w-[65%] px-6 md:pr-10 md:pl-4 pb-10 space-y-8 order-1 md:order-2">

                    {/* Profile Summary */}
                    {user?.personal_details?.profile_summary && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-3 flex items-center gap-2">
                                <span className="text-redMain text-2xl">/</span> About Me
                            </h2>
                            <p className="text-subHeadingGray leading-relaxed text-justify bg-white">
                                {user.personal_details.profile_summary}
                            </p>
                        </div>
                    )}

                    {/* Work Experience */}
                    {user?.work_experiences && user.work_experiences.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-5 flex items-center gap-2">
                                <span className="text-redMain text-2xl">/</span> Experience
                            </h2>
                            <div className="space-y-6">
                                {user.work_experiences.map((work) => (
                                    <div key={work.id} className="relative pl-6 border-l border-dashed border-gray-300">
                                        {/* Dot */}
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-redMain"></div>

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-1">
                                            <h3 className="text-lg font-bold text-slate-800 leading-none">{work.job_title}</h3>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between text-sm mb-2 gap-1">
                                            <span className="font-semibold text-slate-600">{work.company}</span>
                                            <span className="text-redMain font-bold text-xs bg-redMain/5 px-2 py-0.5 rounded w-fit">
                                                {work.start_date} - {work.end_date || 'Present'}
                                            </span>
                                        </div>

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
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-5 flex items-center gap-2">
                                <span className="text-redMain text-2xl">/</span> Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {user.projects.map((proj) => (
                                    <div key={proj.id} className="bg-gray-50 p-4 rounded border-l-4 border-slate-800">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-800">{proj.title}</h3>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase font-bold text-redMain hover:underline shrink-0 ml-2">View ↗</a>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{proj.description}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {proj.technologies.map(t => (
                                                <span key={t.id} className="text-[10px] text-slate-500 border border-gray-300 px-1.5 rounded bg-white">
                                                    {t.value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {user?.profile?.certificates && user.profile.certificates.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                                <span className="text-redMain text-2xl">/</span> Certifications
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {user.profile.certificates.map(cert => (
                                    <div key={cert.id} className="border border-gray-200 p-3 rounded flex flex-col justify-between bg-white">
                                        <div className="font-bold text-sm text-slate-800">{cert.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{cert.issuer} • {cert.date}</div>
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

export default CreativeHeaderTemplate;