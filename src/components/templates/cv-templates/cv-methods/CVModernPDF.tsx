import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { User } from "../../../../types/cv/cv";

interface CVModernPDFProps {
    user?: User;
}

/* --- Fonts --- */
Font.register({
    family: "Times New Roman",
    fonts: [
        { src: "/fonts/Times_New_Roman.ttf" },
        { src: "/fonts/Times_New_Roman_Italic.ttf", fontStyle: "italic" },
        { src: "/fonts/Times_New_Roman_Bold.ttf", fontWeight: "bold" },
        { src: "/fonts/Times_New_Roman_Bold_Italic.ttf", fontWeight: "bold", fontStyle: "italic" },
    ],
});

/* --- Styles --- */
const styles = StyleSheet.create({
    page: {
        padding: 25,
        fontFamily: "Times New Roman",
        fontSize: 11,
        lineHeight: 1.5,
        flexDirection: "row",
    },
    sidebar: {
        width: "32%",
        backgroundColor: "#1E293B",
        color: "white",
        padding: 16,
        flexDirection: "column",
        gap: 12,
    },
    sidebarImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 2,
        borderColor: "#334155",
        marginBottom: 8,
    },
    fullName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        marginBottom: 6,
    },
    sidebarTitle: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#DC2626",
        textTransform: "uppercase",
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#334155",
        paddingBottom: 2,
    },
    sidebarText: { fontSize: 9, marginBottom: 2 },
    sidebarSkill: {
        fontSize: 8,
        backgroundColor: "#334155",
        color: "#E5E7EB",
        padding: 2,
        marginRight: 2,
        marginBottom: 2,
        borderRadius: 2,
    },
    content: {
        width: "68%",
        paddingLeft: 12,
        flexDirection: "column",
        gap: 12,
    },
    section: { marginBottom: 10 },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#DC2626",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    paragraph: {
        fontSize: 9,
        color: "#374151",
        textAlign: "justify",
    },
    card: {
        padding: 6,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 2,
    },
});

const CVModernPDF: React.FC<CVModernPDFProps> = ({ user }) => {
    if (!user) return null;

    const pd = user.personal_details;
    const fullName = `${pd?.first_name || ""} ${pd?.middle_name || ""} ${pd?.last_name || ""}`.trim();

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    {pd?.profile_image ? (
                        <Image
                            src={`${import.meta.env.VITE_APP_API_BASE_URL}${pd.profile_image}`}
                            style={styles.sidebarImage}
                        />
                    ) : (
                        <View style={[styles.sidebarImage, { justifyContent: "center", alignItems: "center" }]}>
                            <Text>{fullName.charAt(0)}</Text>
                        </View>
                    )}
                    <Text style={styles.fullName}>{fullName}</Text>

                    {/* Contact */}
                    <Text style={styles.sidebarTitle}>Contact</Text>
                    {user.email && <Text style={styles.sidebarText}>Email: {user.email}</Text>}
                    {pd?.phone && <Text style={styles.sidebarText}>Phone: {pd.phone}</Text>}
                    {pd?.address && <Text style={styles.sidebarText}>Address: {pd.address}</Text>}
                    {pd?.linkedin && <Text style={styles.sidebarText}>LinkedIn: {pd.linkedin}</Text>}
                    {pd?.github && <Text style={styles.sidebarText}>GitHub: {pd.github}</Text>}

                    {/* Skills */}
                    {user.skill_sets?.length > 0 && (
                        <>
                            <Text style={styles.sidebarTitle}>Skills</Text>
                            {user.skill_sets.map((set) => (
                                <View key={set.id} style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 2 }}>
                                    {set.technical_skills.map((t) => (
                                        <Text key={t.id} style={styles.sidebarSkill}>{t.value}</Text>
                                    ))}
                                    {set.soft_skills.map((s) => (
                                        <Text key={s.id} style={[styles.sidebarSkill, { backgroundColor: "#1E293B80", color: "#9CA3AF" }]}>
                                            {s.value}
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </>
                    )}

                    {/* Languages */}
                    {user.languages?.length > 0 && (
                        <>
                            <Text style={styles.sidebarTitle}>Languages</Text>
                            {user.languages.map((lang) => (
                                <Text key={lang.id} style={styles.sidebarText}>
                                    {lang.language} - {lang.proficiency}
                                </Text>
                            ))}
                        </>
                    )}
                </View>

                {/* Main Content */}
                <View style={styles.content} wrap>
                    {/* Profile */}
                    {pd?.profile_summary && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Profile</Text>
                            <Text style={styles.paragraph}>{pd.profile_summary}</Text>
                        </View>
                    )}

                    {/* Experience */}
                    {user.work_experiences?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Experience</Text>
                            {user.work_experiences.map((w) => (
                                <View key={w.id} style={styles.card} wrap>
                                    <Text style={{ fontWeight: "bold" }}>{w.job_title}</Text>
                                    <Text style={{ fontSize: 8, color: "#DC2626" }}>
                                        {w.start_date} - {w.end_date || "Present"}
                                    </Text>
                                    <Text style={{ fontSize: 9, color: "#374151" }}>
                                        {w.company} • {w.location}
                                    </Text>
                                    {w.responsibilities?.map((r, i) => (
                                        <Text key={i}>• {r.value}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Projects */}
                    {user.projects?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Projects</Text>
                            {user.projects.map((p) => (
                                <View key={p.id} style={styles.card} wrap>
                                    <Text style={{ fontWeight: "bold" }}>{p.title}</Text>
                                    <Text style={styles.paragraph}>{p.description}</Text>
                                    {p.technologies?.length > 0 && (
                                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                            {p.technologies.map((t) => (
                                                <Text key={t.id} style={styles.sidebarSkill}>#{t.value}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Education */}
                    {user.educations?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Education</Text>
                            {user.educations.map((edu) => (
                                <View key={edu.id} style={styles.card} wrap>
                                    <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>
                                    <Text>{edu.institution}</Text>
                                    <Text style={{ fontSize: 8, color: "#DC2626" }}>
                                        {edu.start_date} - {edu.end_date}
                                    </Text>
                                    {edu.grade && <Text style={{ fontSize: 8, color: "#9CA3AF" }}>Grade: {edu.grade}</Text>}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Certifications */}
                    {user.profile?.certificates?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Certifications</Text>
                            {user.profile.certificates.map((c) => (
                                <View key={c.id} style={styles.card} wrap>
                                    <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
                                    <Text style={{ fontSize: 8, color: "#DC2626" }}>{c.issuer}</Text>
                                    {c.date && <Text style={{ fontSize: 7, color: "#9CA3AF" }}>{c.date}</Text>}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Achievements */}
                    {user.achievement_profile?.achievements?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Achievements</Text>
                            {user.achievement_profile.achievements.map((a) => (
                                <Text key={a.id}>• {a.value}</Text>
                            ))}
                        </View>
                    )}

                    {/* References */}
                    {user.references?.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>References</Text>
                            {user.references.map((r) => (
                                <View key={r.id} style={styles.card} wrap>
                                    <Text style={{ fontWeight: "bold" }}>{r.name}</Text>
                                    <Text>{r.position}</Text>
                                    <Text>{r.email}</Text>
                                    <Text>{r.phone}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default CVModernPDF;
