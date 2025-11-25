import type { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

interface AdvancedTemplateProps {
    isPreview?: boolean; // optional prop
}

const TraditionalTemplate = ({ isPreview }: AdvancedTemplateProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    const full_name = `${user?.personal_details?.first_name || ""} ${user?.personal_details?.middle_name || ""} ${user?.personal_details?.last_name || ""}`.trim();
    console.log("the path", user?.personal_details?.profile_image);
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
        <div className="bg-whiteBg w-[210mm] h-[297mm] max-w-full max-h-[90vh] mx-auto p-6 shadow-lg border border-gray-300 rounded-lg overflow-auto">
            {user ? (
                <div className="m-4">
                    {/* --- Header with Profile Image --- */}
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
                                    {full_name}
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
                        <div className="flex flex-col gap-x-2 gap-y-1 text-gray-700">
                            <h2 className="text-base uppercase mt-6">Profile summary</h2>
                            <div className="border-b border-blue-600"></div>
                            <p className="text-justify text-sm">{user?.personal_details?.profile_summary}</p>
                        </div>
                    )}

                    {/* --- Education - Only show if data exists --- */}
                    {user?.educations && user.educations.length > 0 && (
                        <div className="flex flex-col gap-4 text-gray-700">
                            <h2 className="text-base mt-6 uppercase border-b mb-3 pb-1 border-blue-700">
                                Education
                            </h2>

                            {user.educations.map((educa) => (
                                <div
                                    key={educa?.id}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-50 p-4 rounded-lg shadow-sm"
                                >
                                    {/* Degree + Institution */}
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-semibold text-gray-900">{educa?.degree}</h3>
                                        <span className="text-gray-600">{educa?.institution}</span>
                                    </div>

                                    {/* Location + Dates */}
                                    <div className="flex flex-col sm:items-end text-gray-500 text-sm mt-2 sm:mt-0">
                                        <span>{educa?.location}</span>
                                        <span>
                                            {educa?.start_date} – {educa?.end_date}
                                        </span>
                                        <span className="mt-1">Grade: {educa?.grade}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- Work Experience - Only show if data exists --- */}
                    {user?.work_experiences && user.work_experiences.length > 0 && (
                        <div className="flex flex-col text-gray-700">
                            <h2 className="text-base uppercase mt-6 mb-3 border-b border-blue-700 pb-1">
                                Work Experience
                            </h2>

                            {user.work_experiences.map((work) => (
                                <div
                                    key={work?.id}
                                    className="mb-6 pb-4 border-b border-gray-200 last:border-b-0"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <h3 className="text-base font-semibold  text-gray-900">{work?.job_title}</h3>
                                        <span className="text-gray-600 text-sm italic">{work?.company}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between text-gray-500 text-sm mt-1">
                                        <span>{work?.location}</span>
                                        <span>
                                            {work?.start_date} – {work?.end_date || "Present"}
                                        </span>
                                    </div>
                                    {work?.responsibilities && work?.responsibilities.length > 0 && (
                                        <ul className="list-disc list-inside mt-2 text-gray-700 text-sm leading-relaxed space-y-1">
                                            {work?.responsibilities.map((resp, index) => (
                                                <li key={index}>{resp?.value}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- Projects - Only show if data exists --- */}
                    {user?.projects && user.projects.length > 0 && (
                        <div className="flex flex-col gap-4 text-gray-700">
                            <h2 className="text-base text-gray-700 uppercase border-b mb-3 pb-1 border-blue-700">
                                Projects
                            </h2>

                            {user.projects.map((project) => (
                                <div
                                    key={project?.id}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-50 p-4 rounded-lg shadow-sm"
                                >
                                    {/* Project? title and description */}
                                    <div className="flex flex-col sm:w-2/3">
                                        <h3 className="text-lg font-semibold text-gray-900">{project?.title}</h3>
                                        <p className="text-gray-600 mt-1">{project?.description}</p>
                                        {project?.link && (
                                            <a
                                                href={project?.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline mt-1 text-sm"
                                            >
                                                {project?.link}
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:items-end mt-2 sm:mt-0 text-gray-500 text-sm sm:w-1/3">
                                        <span className="mb-1">
                                            Created: {project?.created_at} | Updated: {project?.updated_at}
                                        </span>
                                        {project?.technologies.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {project?.technologies.map((tech) => (
                                                    <span
                                                        key={tech?.id}
                                                        className="bg-green-100 border border-green-300 text-green-700 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        {tech?.value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- Skills - Only show if data exists --- */}
                    {user?.skill_sets && user.skill_sets.length > 0 && (
                        <div className="flex flex-col gap-4 text-gray-700">
                            <h2 className="text-base text-gray-700 uppercase border-b mb-3 pb-1 border-blue-700">
                                Skills
                            </h2>

                            {user.skill_sets.map((skills) => (
                                <div key={skills.id} className="flex flex-col gap-3">
                                    {/* Technical Skills */}
                                    {skills.technical_skills.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Technical Skills:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.technical_skills.map((tech) => (
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

                                    {/* Soft Skills */}
                                    {skills?.soft_skills?.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Soft Skills:</h3>
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
                    )}

                    {/* --- Certifications - Only show if data exists --- */}
                    {user?.profile?.certificates && user.profile.certificates.length > 0 && (
                        <div className="flex flex-col gap-6 text-gray-700 mt-6">
                            <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-4">
                                Certifications
                            </h2>

                            <div className="flex flex-col gap-3">
                                {user?.profile?.certificates.map((cert) => (
                                    <div
                                        key={cert?.id}
                                        className="flex flex-col gap-1 p-3 "
                                    >
                                        <div className="font-medium text-gray-800">{cert?.name}</div>
                                        <div className="text-sm text-gray-500">{cert?.issuer}</div>
                                        <div className="text-sm text-gray-400">{cert?.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- Achievements - Only show if data exists --- */}
                    {user?.achievement_profile?.achievements && user.achievement_profile.achievements.length > 0 && (
                        <div className="flex flex-col gap-4 text-gray-700 mt-6">
                            <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">
                                Achievements
                            </h2>

                            <ul className="list-disc list-inside space-y-1">
                                {user?.achievement_profile?.achievements?.map((ac) => (
                                    <li key={ac?.id} className="text-gray-700">
                                        {ac?.value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* --- Languages - Only show if data exists --- */}
                    {user?.languages && user.languages.length > 0 && (
                        <div className="flex flex-col gap-4 text-gray-700 mt-6">
                            <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">
                                Languages
                            </h2>

                            <ul className="space-y-1">
                                {user?.languages?.map((lang) => (
                                    <li key={lang?.id} className="flex justify-between text-gray-800">
                                        <span>{lang?.language}</span>
                                        <span className="italic text-gray-500">{lang?.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* --- References - Only show if data exists --- */}
                    {user?.references && user.references.length > 0 && (
                        <div className="flex flex-col gap-4 text-gray-700 mt-6">
                            <h2 className="text-lg font-semibold uppercase border-b border-blue-700 pb-1 mb-2">
                                References
                            </h2>

                            <ul className="space-y-4">
                                {user?.references?.map((ref) => (
                                    <li key={ref?.id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                                        <div className="text-gray-800 font-medium">{ref?.name}</div>
                                        <div className="text-gray-600 text-sm">{ref?.position}</div>
                                        <div className="text-gray-600 text-sm">{ref?.email}</div>
                                        <div className="text-gray-600 text-sm">{ref?.phone}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-600">
                    No user details found. Please fill CV details.
                </p>
            )}
        </div>
    );
};

export default TraditionalTemplate;