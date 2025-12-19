import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { User } from "../../../../types/cv/cv";

interface CVAdvancedPDFProps {
  user?: User;
}

// Register font
Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/fonts/Times_New_Roman.ttf" },
    { src: "/fonts/Times_New_Roman_Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Times_New_Roman_Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Times_New_Roman_Bold_Italic.ttf", fontWeight: "bold", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Times New Roman",
    fontSize: 11,
    lineHeight: 1.5,
    width: "210mm",
    minHeight: "297mm",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  photo: {
    width: 90,
    height: 90,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#1E40AF",
  },
  headerText: { flexGrow: 1 },
  name: { fontSize: 22, fontWeight: "bold", textTransform: "uppercase", color: "#1E40AF", marginBottom: 6 },
  contact: { fontSize: 10, color: "#1D4ED8" },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#1E40AF",
    paddingBottom: 2,
    marginBottom: 6,
    color: "#1E40AF",
  },
  card: { padding: 6, backgroundColor: "#F8FAFC", borderLeftWidth: 4, borderLeftColor: "#2563EB", marginBottom: 6 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  paragraph: { marginBottom: 4, textAlign: "justify" },
  badge: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    marginRight: 4,
    marginBottom: 4,
  },
  footer: { marginTop: 12, textAlign: "center", fontSize: 9, color: "#555", fontStyle: "italic" },
});

const CVAdvancedPDF: React.FC<CVAdvancedPDFProps> = ({ user }) => {
  if (!user) return null;

  const fullName = `${user.personal_details?.first_name || ""} ${user.personal_details?.middle_name || ""} ${user.personal_details?.last_name || ""}`.trim();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          {user.personal_details?.profile_image && (
            <Image
              src={`${import.meta.env.VITE_APP_API_BASE_URL}${user.personal_details.profile_image}`}
              style={styles.photo}
            />
          )}

          <View style={styles.headerText}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.contact}>
              {user.personal_details?.phone}
              {user.email && ` | ${user.email}`}
              {user.personal_details?.address && ` | ${user.personal_details.address}`}
              {user.personal_details?.github && ` | ${user.personal_details.github}`}
              {user.personal_details?.linkedin && ` | ${user.personal_details.linkedin}`}
            </Text>
          </View>
        </View>

        {/* PROFILE SUMMARY */}
        {user.personal_details?.profile_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Summary</Text>
            <View style={styles.card}>
              <Text style={styles.paragraph}>{user.personal_details.profile_summary}</Text>
            </View>
          </View>
        )}

        {/* EDUCATION */}
        {user.educations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {user.educations.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>
                  <Text>{edu.start_date} – {edu.end_date}</Text>
                </View>
                <Text>{edu.institution}</Text>
                <Text>{edu.location}</Text>
                {edu.grade && <Text>Grade: {edu.grade}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {user.work_experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {user.work_experiences.map((work) => (
              <View key={work.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontWeight: "bold" }}>{work.job_title}</Text>
                  <Text>{work.start_date} – {work.end_date || "Present"}</Text>
                </View>
                <Text style={{ fontStyle: "italic" }}>{work.company}</Text>
                <Text>{work.location}</Text>
                {work.responsibilities?.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {work.responsibilities.map((r, i) => (
                      <Text key={i}>• {r.value}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {user.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {user.projects.map((proj) => (
              <View key={proj.id} style={styles.card}>
                <Text style={{ fontWeight: "bold" }}>{proj.title}</Text>
                <Text style={styles.paragraph}>{proj.description}</Text>
                {proj.technologies?.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {proj.technologies.map((t) => (
                      <Text key={t.id} style={styles.badge}>{t.value}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {user.skill_sets?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {user.skill_sets.map((set) => (
              <View key={set.id} style={{ marginBottom: 6 }}>
                {set.technical_skills?.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 2 }}>
                    {set.technical_skills.map((t) => (
                      <Text key={t.id} style={styles.badge}>{t.value}</Text>
                    ))}
                  </View>
                )}
                {set.soft_skills?.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {set.soft_skills.map((s) => (
                      <Text key={s.id} style={[styles.badge, { backgroundColor: "#DCFCE7", color: "#166534" }]}>{s.value}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* LANGUAGES */}
        {user.languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {user.languages.map((l) => (
                <Text key={l.id} style={styles.badge}>
                  {l.language} ({l.proficiency})
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ACHIEVEMENTS */}
        {user.achievement_profile?.achievements?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {user.achievement_profile.achievements.map((a) => (
              <Text key={a.id}>• {a.value}</Text>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {user.profile?.certificates?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {user.profile.certificates.map((c) => (
              <View key={c.id} style={styles.card}>
                <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
                <Text>{c.issuer}</Text>
                <Text style={{ fontStyle: "italic" }}>{c.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* REFERENCES */}
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

        {/* FOOTER */}
        <Text style={styles.footer}>Generated CV • Advanced Template</Text>
      </Page>
    </Document>
  );
};

export default CVAdvancedPDF;
