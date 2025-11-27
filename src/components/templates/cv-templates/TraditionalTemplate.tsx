import type {  RootState } from "../../../store/store";
import { useSelector } from "react-redux";

interface AdvancedTemplateProps {
    isPreview?: boolean; // optional prop
}

const TraditionalTemplate = ({ isPreview }: AdvancedTemplateProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    const full_name = `${user?.personal_details?.first_name || ""} ${user?.personal_details?.middle_name || ""} ${user?.personal_details?.last_name || ""}`.trim();

    // Loading/Skeleton State
    if (!user && isPreview) {
        return (
            <div className="w-full max-w-[210mm] mx-auto space-y-4 p-4 bg-background text-text">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="h-4 w-32 rounded animate-pulse bg-gray-300"></div>
                    <div className="flex gap-2">
                        <div className="h-3 w-16 rounded animate-pulse bg-gray-200"></div>
                        <div className="h-3 w-16 rounded animate-pulse bg-gray-200"></div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="h-3 w-full rounded animate-pulse bg-gray-200"></div>
                        <div className="h-20 w-full rounded animate-pulse bg-gray-100"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-full rounded animate-pulse bg-gray-200"></div>
                        <div className="h-20 w-full rounded animate-pulse bg-gray-100"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // Main Container: 
        // 1. Mobile: w-full, auto height, natural flow.
        // 2. Desktop (md): Fixed A4 width (210mm), min-height A4, centered.
        // 3. Print: Forces A4 dimensions, removes shadows/margins.
        <div className="
            bg-whiteBg bg-white 
            w-full md:w-[210mm] md:min-h-[297mm] 
            mx-auto 
            p-4 md:p-8 
            shadow-none md:shadow-lg 
            border-0 md:border border-gray-300 
            rounded-none md:rounded-lg 
            overflow-hidden
            print:w-[210mm] print:h-[297mm] print:shadow-none print:border-0 print:m-0 print:p-8 print:overflow-visible
        ">
            {user ? (
                <div className="space-y-6 text-sm md:text-base">
                    
                    {/* --- Header with Profile Image --- */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
                            {/* Profile Image */}
                            {user?.personal_details?.profile_image && (
                                <div className="mx-auto md:mx-0 shrink-0">
                                    <img
                                        src={`${import.meta.env.VITE_APP_API_BASE_URL}${user?.personal_details?.profile_image}`}
                                        alt="Profile"
                                        className="w-24 h-24 md:w-32 md:h-32 object-cover border-2 border-blue-700 block"
                                        style={{ borderRadius: 0 }} 
                                    />
                                </div>
                            )}

                            {/* Name and Contact */}
                            <div className="flex flex-col justify-center text-center md:text-left w-full">
                                <h1
                                    className="text-2xl md:text-3xl font-bold uppercase text-blue-800 mb-2"
                                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                                >
                                    {full_name}
                                </h1>

                                <div
                                    className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-blue-700 text-sm leading-relaxed"
                                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                                >
                                    {user?.personal_details?.phone && <span>{user?.personal_details?.phone}</span>}
                                    {user?.email && <span className="hidden md:inline">|</span>}
                                    {user?.email && <span>{user.email}</span>}
                                    {user?.personal_details?.address && <span className="hidden md:inline">|</span>}
                                    {user?.personal_details?.address && <span>{user?.personal_details?.address}</span>}
                                    {user?.personal_details?.github && <span className="hidden md:inline">|</span>}
                                    {user?.personal_details?.github && <span>{user?.personal_details?.github}</span>}
                                    {user?.personal_details?.linkedin && <span className="hidden md:inline">|</span>}
                                    {user?.personal_details?.linkedin && <span>{user?.personal_details?.linkedin}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Profile Summary --- */}
                    {user?.personal_details?.profile_summary && (
                        <div className="text-gray-700">
                            <h2 className="text-base font-bold uppercase border-b border-blue-600 mb-2">Profile summary</h2>
                            <p className="text-justify text-sm leading-relaxed">{user?.personal_details?.profile_summary}</p>
                        </div>
                    )}

                    {/* --- Education --- */}
                    {user?.educations && user.educations.length > 0 && (
                        <div className="text-gray-700">
                            <h2 className="text-base font-bold uppercase border-b border-blue-700 mb-3 pb-1">Education</h2>
                            <div className="space-y-4">
                                {user.educations.map((educa) => (
                                    <div key={educa?.id} className="flex flex-col md:flex-row md:justify-between md:items-start bg-gray-50 p-3 rounded shadow-sm print:bg-transparent print:shadow-none print:p-0">
                                        <div className="flex flex-col">
                                            <h3 className="text-base font-semibold text-gray-900">{educa?.degree}</h3>
                                            <span className="text-gray-600">{educa?.institution}</span>
                                        </div>
                                        <div className="flex flex-col md:items-end text-gray-500 text-sm mt-1 md:mt-0">
                                            <span>{educa?.location}</span>
                                            <span>{educa?.start_date} – {educa?.end_date}</span>
                                            {educa?.grade && <span className="mt-1 font-medium">Grade: {educa?.grade}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Work Experience --- */}
                    {user?.work_experiences && user.work_experiences.length > 0 && (
                        <div className="text-gray-700">
                            <h2 className="text-base font-bold uppercase border-b border-blue-700 mb-3 pb-1">Work Experience</h2>
                            <div className="space-y-6">
                                {user.work_experiences.map((work) => (
                                    <div key={work?.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                                            <h3 className="text-base font-semibold text-gray-900">{work?.job_title}</h3>
                                            <span className="text-gray-600 text-sm italic">{work?.company}</span>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row md:justify-between text-gray-500 text-sm mb-2">
                                            <span>{work?.location}</span>
                                            <span>{work?.start_date} – {work?.end_date || "Present"}</span>
                                        </div>

                                        {work?.responsibilities && work?.responsibilities.length > 0 && (
                                            <ul className="list-disc list-outside ml-4 text-gray-700 text-sm leading-relaxed space-y-1">
                                                {work?.responsibilities.map((resp, index) => (
                                                    <li key={index}>{resp?.value}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Projects --- */}
                    {user?.projects && user.projects.length > 0 && (
                        <div className="text-gray-700">
                            <h2 className="text-base font-bold uppercase border-b border-blue-700 mb-3 pb-1">Projects</h2>
                            <div className="space-y-4">
                                {user.projects.map((project) => (
                                    <div key={project?.id} className="flex flex-col md:flex-row md:justify-between md:items-start bg-gray-50 p-3 rounded shadow-sm print:bg-transparent print:shadow-none print:p-0">
                                        <div className="flex flex-col md:w-3/4">
                                            <h3 className="text-base font-semibold text-gray-900">{project?.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{project?.description}</p>
                                            {project?.link && (
                                                <a href={project?.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-1 text-xs break-all">
                                                    {project?.link}
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex flex-col md:items-end mt-2 md:mt-0 text-gray-500 text-xs md:w-1/4">
                                            <span className="mb-1">{project?.created_at}</span>
                                            {project?.technologies.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1 justify-start md:justify-end">
                                                    {project?.technologies.map((tech) => (
                                                        <span key={tech?.id} className="bg-green-100 border border-green-300 text-green-700 px-2 py-0.5 rounded-full text-[10px]">
                                                            {tech?.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Skills --- */}
                    {user?.skill_sets && user.skill_sets.length > 0 && (
                        <div className="text-gray-700">
                            <h2 className="text-base font-bold uppercase border-b border-blue-700 mb-3 pb-1">Skills</h2>
                            {user.skill_sets.map((skills) => (
                                <div key={skills.id} className="flex flex-col gap-3">
                                    {skills.technical_skills.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Technical Skills:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.technical_skills.map((tech) => (
                                                    <span key={tech?.id} className="bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                                        {tech?.value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {skills?.soft_skills?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Soft Skills:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills?.soft_skills?.map((soft) => (
                                                    <span key={soft?.id} className="bg-green-50 border border-green-200 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                                                        {soft?.value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- Three Column Grid for Minor Sections (Certifications, Languages, Achievements) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        
                        {/* Certifications */}
                        {user?.profile?.certificates && user.profile.certificates.length > 0 && (
                            <div className="flex flex-col">
                                <h2 className="text-base font-bold uppercase border-b border-blue-700 pb-1 mb-2">Certifications</h2>
                                <div className="space-y-3">
                                    {user?.profile?.certificates.map((cert) => (
                                        <div key={cert?.id} className="text-sm">
                                            <div className="font-semibold text-gray-800">{cert?.name}</div>
                                            <div className="text-gray-500 text-xs">{cert?.issuer} &bull; {cert?.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {user?.languages && user.languages.length > 0 && (
                            <div className="flex flex-col">
                                <h2 className="text-base font-bold uppercase border-b border-blue-700 pb-1 mb-2">Languages</h2>
                                <ul className="space-y-1">
                                    {user?.languages?.map((lang) => (
                                        <li key={lang?.id} className="flex justify-between text-sm text-gray-800 border-b border-gray-100 pb-1 last:border-0">
                                            <span>{lang?.language}</span>
                                            <span className="italic text-gray-500 text-xs">{lang?.proficiency}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                         {/* Achievements */}
                         {user?.achievement_profile?.achievements && user.achievement_profile.achievements.length > 0 && (
                            <div className="flex flex-col">
                                <h2 className="text-base font-bold uppercase border-b border-blue-700 pb-1 mb-2">Achievements</h2>
                                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                                    {user?.achievement_profile?.achievements?.map((ac) => (
                                        <li key={ac?.id}>{ac?.value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* --- References --- */}
                    {user?.references && user.references.length > 0 && (
                        <div className="text-gray-700 pt-4">
                            <h2 className="text-base font-bold uppercase border-b border-blue-700 pb-1 mb-3">References</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user?.references?.map((ref) => (
                                    <div key={ref?.id} className="bg-gray-50 p-3 rounded-lg shadow-sm print:bg-transparent print:shadow-none print:border print:border-gray-200">
                                        <div className="text-gray-900 font-semibold">{ref?.name}</div>
                                        <div className="text-gray-600 text-sm">{ref?.position}</div>
                                        <div className="text-blue-600 text-xs mt-1">{ref?.email}</div>
                                        <div className="text-gray-500 text-xs">{ref?.phone}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                    <p className="text-center text-gray-500 font-medium">
                        No user details found. Please fill in your CV details.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TraditionalTemplate;