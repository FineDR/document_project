import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import type { User } from "../../../../types/cv/cv";

interface CVTraditionalPDFProps {
    user?: User;
}

/* Font */
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
    padding: 32,
    fontFamily: "Times New Roman",
    fontSize: 11,
    lineHeight: 1.6,
    width: "210mm",
    minHeight: "297mm",
  },

  /* HEADER */
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 520,
  },
  photo: {
    width: 90,
    height: 90,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#1E40AF",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#1E40AF",
    marginBottom: 4,
  },
  contact: {
    fontSize: 10,
    color: "#1D4ED8",
    flexWrap: "wrap",
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#1E40AF",
    paddingBottom: 2,
    marginBottom: 8,
  },

  card: {
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paragraph: {
    textAlign: "justify",
    marginBottom: 4,
  },

  tagBlue: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    marginRight: 4,
    marginBottom: 4,
  },

  tagGreen: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    color: "#166534",
    marginRight: 4,
    marginBottom: 4,
  },
});

const CVTraditionalPDF: React.FC<CVTraditionalPDFProps> = ({ user }) => {
  if (!user) return null;

  const pd = user.personal_details;
  const fullName = `${pd?.first_name || ""} ${pd?.middle_name || ""} ${pd?.last_name || ""}`.trim();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {pd?.profile_image && (
              <Image
                src={`${import.meta.env.VITE_APP_API_BASE_URL}${pd.profile_image}`}
                style={styles.photo}
              />
            )}
            <View>
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.contact}>
                {pd?.phone}
                {user.email && ` | ${user.email}`}
                {pd?.address && ` | ${pd.address}`}
                {pd?.github && ` | ${pd.github}`}
                {pd?.linkedin && ` | ${pd.linkedin}`}
              </Text>
            </View>
          </View>
        </View>

        {/* PROFILE SUMMARY */}
        {pd?.profile_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Summary</Text>
            <View style={styles.card}>
              <Text style={styles.paragraph}>{pd.profile_summary}</Text>
            </View>
          </View>
        )}

        {/* EDUCATION */}
        {user.educations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {user.educations.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>
                <Text>{edu.institution}</Text>
                <Text style={{ fontSize: 10, color: "#555" }}>
                  {edu.location} • {edu.start_date} – {edu.end_date}
                </Text>
                {edu.grade && (
                  <Text style={{ fontSize: 10, color: "#1E40AF" }}>
                    Grade: {edu.grade}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {user.work_experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {user.work_experiences.map((work) => (
              <View key={work.id} style={styles.card} wrap={false}>
                <View style={styles.row}>
                  <Text style={{ fontWeight: "bold" }}>{work.job_title}</Text>
                  <Text>
                    {work.start_date} – {work.end_date || "Present"}
                  </Text>
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
                      <Text key={t.id} style={styles.tagGreen}>
                        {t.value}
                      </Text>
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
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {set.technical_skills.map((s) => (
                      <Text key={s.id} style={styles.tagBlue}>
                        {s.value}
                      </Text>
                    ))}
                  </View>
                )}
                {set.soft_skills?.length > 0 && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {set.soft_skills.map((s) => (
                      <Text key={s.id} style={styles.tagGreen}>
                        {s.value}
                      </Text>
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
            {user.languages.map((l) => (
              <View key={l.id} style={styles.card}>
                <Text>
                  {l.language} — {l.proficiency}
                </Text>
              </View>
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
                <Text style={{ fontSize: 10 }}>{c.date}</Text>
              </View>
            ))}
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
      </Page>
    </Document>
  );
};

export default CVTraditionalPDF;
