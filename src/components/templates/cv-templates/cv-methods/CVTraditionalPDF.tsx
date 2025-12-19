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

/* Font */
Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/fonts/Times_New_Roman.ttf" },
    { src: "/fonts/Times_New_Roman_Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Times_New_Roman_Bold.ttf", fontWeight: "bold" },
    {
      src: "/fonts/Times_New_Roman_Bold_Italic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

interface CVTraditionalPDFProps {
  user?: User;
}

const styles = StyleSheet.create({
  /* PAGE */
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36, // standard A4 margin
    fontFamily: "Times New Roman",
    fontSize: 11,
    lineHeight: 1.6,
  },

  /* HEADER */
  header: {
    marginBottom: 24,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  photo: {
    width: 96,
    height: 96,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#1E40AF",
  },

  headerContent: {
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#1E40AF",
    marginBottom: 6,
  },

  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "100%",
  },

  contactItem: {
    fontSize: 10,
    color: "#1D4ED8",
    marginRight: 6,
    marginBottom: 2,
  },

  /* SECTIONS */
  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#1E40AF",
    paddingBottom: 2,
    marginBottom: 8,
  },

  paragraph: {
    textAlign: "justify",
  },

  card: {
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  listItem: {
    marginLeft: 10,
    marginBottom: 2,
  },

  tagBlue: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 10,
  },

  tagGreen: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#DCFCE7",
    color: "#166534",
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 10,
  },

  grid3: {
    flexDirection: "row",
    gap: 12,
  },

  col: {
    flex: 1,
  },
});

const CVTraditionalPDF: React.FC<CVTraditionalPDFProps> = ({
  user,
}) => {
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

            <View style={styles.headerContent}>
              <Text style={styles.name}>{fullName}</Text>

              <View style={styles.contactRow}>
                {pd?.phone && <Text style={styles.contactItem}>{pd.phone}</Text>}
                {user.email && (
                  <Text style={styles.contactItem}>| {user.email}</Text>
                )}
                {pd?.address && (
                  <Text style={styles.contactItem}>| {pd.address}</Text>
                )}
                {pd?.github && (
                  <Text style={styles.contactItem}>| {pd.github}</Text>
                )}
                {pd?.linkedin && (
                  <Text style={styles.contactItem}>| {pd.linkedin}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* PROFILE SUMMARY */}
        {pd?.profile_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Summary</Text>
            <Text style={styles.paragraph}>{pd.profile_summary}</Text>
          </View>
        )}

        {/* EDUCATION */}
        {user.educations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {user.educations.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>
                    <Text>{edu.institution}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10 }}>{edu.location}</Text>
                    <Text style={{ fontSize: 10 }}>
                      {edu.start_date} – {edu.end_date}
                    </Text>
                    {edu.grade && (
                      <Text style={{ fontSize: 10 }}>Grade: {edu.grade}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {user.work_experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {user.work_experiences.map((work) => (
              <View key={work.id} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontWeight: "bold" }}>{work.job_title}</Text>
                  <Text style={{ fontStyle: "italic" }}>{work.company}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text>{work.location}</Text>
                  <Text>
                    {work.start_date} – {work.end_date || "Present"}
                  </Text>
                </View>

                {work.responsibilities?.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {work.responsibilities.map((r, i) => (
                      <Text key={i} style={styles.listItem}>
                        • {r.value}
                      </Text>
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
                <Text>{proj.description}</Text>

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
              <View key={set.id}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {set.technical_skills?.map((s) => (
                    <Text key={s.id} style={styles.tagBlue}>
                      {s.value}
                    </Text>
                  ))}
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {set.soft_skills?.map((s) => (
                    <Text key={s.id} style={styles.tagGreen}>
                      {s.value}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS / LANGUAGES / ACHIEVEMENTS */}
        <View style={[styles.section, styles.grid3]}>
          {user.profile?.certificates?.length > 0 && (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {user.profile.certificates.map((c) => (
                <Text key={c.id}>
                  {c.name} — {c.issuer} ({c.date})
                </Text>
              ))}
            </View>
          )}

          {user.languages?.length > 0 && (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {user.languages.map((l) => (
                <Text key={l.id}>
                  {l.language} — {l.proficiency}
                </Text>
              ))}
            </View>
          )}

          {user.achievement_profile?.achievements?.length > 0 && (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              {user.achievement_profile.achievements.map((a) => (
                <Text key={a.id}>• {a.value}</Text>
              ))}
            </View>
          )}
        </View>

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
