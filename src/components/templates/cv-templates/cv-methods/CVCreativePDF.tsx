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

interface CVCreativePDFProps {
  user?: User;
}

/* Fonts */
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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times New Roman",
    fontSize: 10,
    lineHeight: 1.6,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    backgroundColor: "#0F172A",
    padding: 20,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginRight: 16,
  },
  firstName: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  lastName: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#E3342F",
  },

  body: {
    flexDirection: "row",
  },

  left: {
    width: "35%",
    paddingRight: 16,
  },
  right: {
    width: "65%",
    paddingLeft: 16,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitleLeft: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },

  sectionTitleRight: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  slash: {
    color: "#E3342F",
    fontSize: 18,
    marginRight: 6,
  },

  contactBox: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#E3342F",
  },

  tagDark: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },

  tagLight: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },

  timeline: {
    borderLeftWidth: 2,
    borderLeftColor: "#E3342F",
    paddingLeft: 10,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#0F172A",
    marginBottom: 8,
  },
});

const CVCreativePDF: React.FC<CVCreativePDFProps> = ({ user }) => {
  if (!user) return null;
  const pd = user.personal_details;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {pd?.profile_image && (
              <Image
                src={`${import.meta.env.VITE_APP_API_BASE_URL}${pd.profile_image}`}
                style={styles.avatar}
              />
            )}
            <View>
              <Text style={styles.firstName}>{pd?.first_name}</Text>
              <Text style={styles.lastName}>{pd?.last_name}</Text>
            </View>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          {/* LEFT */}
          <View style={styles.left}>
            {/* CONTACT */}
            <View style={[styles.section, styles.contactBox]}>
              <Text style={styles.sectionTitleLeft}>Contact</Text>
              {user.email && <Text>{user.email}</Text>}
              {pd?.phone && <Text>{pd.phone}</Text>}
              {pd?.address && <Text>{pd.address}</Text>}
              {pd?.github && <Text>{pd.github}</Text>}
              {pd?.linkedin && <Text>{pd.linkedin}</Text>}
            </View>

            {/* EDUCATION */}
            {user.educations?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleLeft}>Education</Text>
                {user.educations.map((e) => (
                  <View key={e.id} style={{ marginBottom: 8 }}>
                    <Text style={{ fontWeight: "bold", color: "#E3342F" }}>
                      {e.degree}
                    </Text>
                    <Text>{e.institution}</Text>
                    <Text style={{ fontSize: 8 }}>
                      {e.start_date} – {e.end_date}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* SKILLS */}
            {user.skill_sets?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleLeft}>Skills</Text>
                {user.skill_sets.map((s) => (
                  <View key={s.id}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {s.technical_skills.map((t) => (
                        <Text key={t.id} style={styles.tagDark}>
                          {t.value}
                        </Text>
                      ))}
                      {s.soft_skills.map((t) => (
                        <Text key={t.id} style={styles.tagLight}>
                          {t.value}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* LANGUAGES */}
            {user.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleLeft}>Languages</Text>
                {user.languages.map((l) => (
                  <Text key={l.id}>
                    {l.language} — {l.proficiency}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT */}
          <View style={styles.right}>
            {/* PROFILE SUMMARY */}
            {pd?.profile_summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleRight}>
                  <Text style={styles.slash}>/</Text> Profile Summary
                </Text>
                <Text>{pd.profile_summary}</Text>
              </View>
            )}

            {/* EXPERIENCE */}
            {user.work_experiences?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleRight}>
                  <Text style={styles.slash}>/</Text> Experience
                </Text>
                {user.work_experiences.map((w) => (
                  <View key={w.id} style={styles.timeline}>
                    <Text style={{ fontWeight: "bold" }}>{w.job_title}</Text>
                    <Text>{w.company}</Text>
                    <Text style={{ fontSize: 8 }}>
                      {w.start_date} – {w.end_date || "Present"}
                    </Text>
                    {w.responsibilities?.map((r, i) => (
                      <Text key={i}>• {r.value}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* PROJECTS */}
            {user.projects?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleRight}>
                  <Text style={styles.slash}>/</Text> Projects
                </Text>
                {user.projects.map((p) => (
                  <View key={p.id} style={styles.card}>
                    <Text style={{ fontWeight: "bold" }}>{p.title}</Text>
                    <Text>{p.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* CERTIFICATIONS */}
            {user.profile?.certificates?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleRight}>
                  <Text style={styles.slash}>/</Text> Certifications
                </Text>
                {user.profile.certificates.map((c) => (
                  <View key={c.id} style={styles.card}>
                    <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
                    <Text>{c.issuer}</Text>
                    <Text style={{ fontSize: 8 }}>{c.date}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ACHIEVEMENTS */}
            {user.achievement_profile?.achievements?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleRight}>
                  <Text style={styles.slash}>/</Text> Achievements
                </Text>
                {user.achievement_profile.achievements.map((a) => (
                  <Text key={a.id}>• {a.value}</Text>
                ))}
              </View>
            )}

            {/* REFERENCES */}
            {user.references?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitleRight}>
                  <Text style={styles.slash}>/</Text> References
                </Text>
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

export default CVCreativePDF;
