import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { RisalaData } from "../../../types/risalaTypes";

// Register the same font as PDFTraditional
Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/fonts/Times_New_Roman.ttf" },
    { src: "/fonts/Times_New_Roman_Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Times_New_Roman_Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Times_New_Roman_Bold_Italic.ttf", fontWeight: "bold", fontStyle: "italic" },
  ],
});

interface PDFMinimalProps {
  risala: RisalaData;
}

const styles = StyleSheet.create({
  page: {
    padding: 28, // ~28mm
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineHeight: 1.5,
    width: "210mm",
    minHeight: "297mm",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#E3342F", // Primary accent from template
  },
  subtitle: {
    fontSize: 10,
    color: "#555",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#CBD5E0", // Subheading gray
    marginVertical: 6,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#555",
  },
  card: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 4,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 6,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    fontStyle: "italic",
    color: "#555",
  },
});

const stripMarkdown = (text?: string) =>
  text ? text.replace(/\*\*/g, "") : "";


const PDFMinimal: React.FC<PDFMinimalProps> = ({ risala }) => {
  if (!risala) return null;

  const { raw_data, generated_risala } = risala;
  const paragraphs = generated_risala?.split("\n") || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {stripMarkdown(raw_data.event_title) || "RISALA YA TUKIO"}
          </Text>

          <Text style={styles.subtitle}>
            {(raw_data.event_type || "EVENT").toUpperCase()} • {raw_data.event_date || "Tarehe Haipo"} • {raw_data.event_location || "Mahali Hapajatajwa"}
          </Text>
          <View style={styles.divider} />
        </View>

        {/* GUEST & ORGANIZATION CARDS */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Mgeni Rasmi</Text>
              <Text>{raw_data.guest_of_honor || "—"}</Text>
              <Text style={{ fontSize: 10 }}>
                ({raw_data.guest_title || "Cheo hakijatajwa"})
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 6 }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Shirika</Text>
              <Text>{raw_data.organization_name || "—"}</Text>
              {raw_data.organization_representative && (
                <Text style={{ fontSize: 10 }}>Mwakilishi: {raw_data.organization_representative}</Text>
              )}
            </View>
          </View>
        </View>

        {/* PURPOSE & BACKGROUND */}
        {raw_data.purpose_statement && (
          <View style={{ ...styles.card, marginBottom: 6 }}>
            <Text style={styles.sectionTitle}>Madhumuni ya Risala</Text>
            <Text>{raw_data.purpose_statement}</Text>
          </View>
        )}
        {raw_data.background_info && (
          <View style={{ ...styles.card, marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Historia Fupi</Text>
            <Text>{raw_data.background_info}</Text>
          </View>
        )}

        {/* MAIN RISALA */}
        {paragraphs.length > 0 && (
          <View style={styles.section}>
            <Text style={{ ...styles.sectionTitle, fontSize: 16, marginBottom: 8 }}>Risala Kamili</Text>
            {paragraphs.map((p, i) => (
              <Text key={i} style={styles.paragraph}>
                {stripMarkdown(p)}
              </Text>
            ))}

          </View>
        )}

        {/* FOOTER */}
        <Text style={styles.footer}>— Mwisho wa Risala —</Text>
      </Page>
    </Document>
  );
};

export default PDFMinimal;
