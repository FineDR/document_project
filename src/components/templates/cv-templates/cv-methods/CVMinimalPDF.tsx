import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { User } from "../../../../types/cv/cv";

interface CVMinimalPDFProps {
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
    width: "210mm",
    minHeight: "297mm",
    fontFamily: "Times New Roman",
    fontSize: 11,
    lineHeight: 1.6,
    padding: 25, // standard 1 inch margin
  },
  topBorder: {
    height: 8,
    backgroundColor: "#DC2626",
    marginBottom: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: "#6B7280",
    textAlign: "center",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    flex: 1,
    gap: 16,
  },
  leftColumn: {
    width: "65%",
  },
  rightColumn: {
    width: "35%",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#DC2626",
    textTransform: "uppercase",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#DC2626",
    paddingBottom: 2,
  },
  paragraph: {
    fontSize: 9,
    color: "#6B7280",
    textAlign: "justify",
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 2,
  },
  skillTag: {
    fontSize: 7,
    color: "#111827",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 2,
  },
});

const CVMinimalPDF: React.FC<CVMinimalPDFProps> = ({ user }) => {
  if (!user) return null;

  const pd = user.personal_details;
  const fullName = `${pd?.first_name || ""} ${pd?.middle_name || ""} ${pd?.last_name || ""}`.trim();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Top Red Border */}
        <View style={styles.topBorder} />

        {/* HEADER */}
        <View style={styles.header}>
          {pd?.profile_image && (
            <Image
              src={`${import.meta.env.VITE_APP_API_BASE_URL}${pd.profile_image}`}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.contact}>
            {pd?.phone && ` ${pd.phone} | `}
            {user.email && ` ${user.email} | `}
            {pd?.address && ` ${pd.address} | `}
            {pd?.linkedin && `LinkedIn: ${pd.linkedin} | `}
            {pd?.github && `GitHub: ${pd.github}`}
          </Text>
        </View>

        {/* MAIN BODY */}
        <View style={styles.container}>
          {/* LEFT COLUMN */}
          <View style={styles.leftColumn}>
            {pd?.profile_summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Profile</Text>
                <Text style={styles.paragraph}>{pd.profile_summary}</Text>
              </View>
            )}

            {user.work_experiences?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {user.work_experiences.map((work) => (
                  <View key={work.id} style={{ marginBottom: 6 }}>
                    <Text style={{ fontWeight: "bold" }}>{work.job_title}</Text>
                    <Text style={{ fontSize: 8, color: "#DC2626" }}>
                      {work.start_date} - {work.end_date || "Present"}
                    </Text>
                    <Text style={{ fontSize: 9, color: "#6B7280" }}>
                      {work.company}, {work.location}
                    </Text>
                    {work.responsibilities?.map((r, i) => (
                      <Text key={i}>• {r.value}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {user.projects?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Projects</Text>
                {user.projects.map((proj) => (
                  <View key={proj.id} style={{ marginBottom: 6 }}>
                    <Text style={{ fontWeight: "bold" }}>{proj.title}</Text>
                    <Text style={styles.paragraph}>{proj.description}</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {proj.technologies?.map((t) => (
                        <Text key={t.id} style={styles.skillTag}>#{t.value}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {user.achievement_profile?.achievements?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {user.achievement_profile.achievements.map((a) => (
                  <Text key={a.id}>• {a.value}</Text>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightColumn}>
            {user.educations?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {user.educations.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: "bold", color: "#DC2626" }}>{edu.degree}</Text>
                    <Text>{edu.institution}</Text>
                    <Text style={{ fontSize: 8, color: "#6B7280" }}>
                      {edu.start_date} - {edu.end_date}
                    </Text>
                    {edu.grade && <Text style={{ fontSize: 8, color: "#9CA3AF" }}>Grade: {edu.grade}</Text>}
                  </View>
                ))}
              </View>
            )}

            {user.skill_sets?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {user.skill_sets.map((set) => (
                  <View key={set.id} style={{ marginBottom: 4 }}>
                    {set.technical_skills?.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 2 }}>
                        {set.technical_skills.map((t) => (
                          <Text key={t.id} style={styles.skillTag}>{t.value}</Text>
                        ))}
                      </View>
                    )}
                    {set.soft_skills?.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {set.soft_skills.map((s) => (
                          <Text key={s.id} style={styles.skillTag}>{s.value}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {user.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {user.languages.map((l) => (
                  <Text key={l.id}>
                    {l.language} — {l.proficiency}
                  </Text>
                ))}
              </View>
            )}

            {user.profile?.certificates?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {user.profile.certificates.map((c) => (
                  <View key={c.id} style={styles.card}>
                    <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
                    <Text>{c.issuer}</Text>
                    <Text style={{ fontSize: 8 }}>{c.date}</Text>
                  </View>
                ))}
              </View>
            )}

            {user.references?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>References</Text>
                {user.references.map((r) => (
                  <View key={r.id} style={styles.card}>
                    <Text style={{ fontWeight: "bold" }}>{r.name}</Text>
                    <Text>{r.position}</Text>
                    <Text>{r.email}</Text>
                    <Text>{r.phone}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVMinimalPDF;
