import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { RisalaData } from "../../../types/risalaTypes";

Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/fonts/Times_New_Roman.ttf" },
    { src: "/fonts/Times_New_Roman_Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Times_New_Roman_Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Times_New_Roman_Bold_Italic.ttf", fontWeight: "bold", fontStyle: "italic" },
  ],
});

interface PDFTraditionalProps {
  risala: RisalaData;
}

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: { textAlign: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#555", marginBottom: 8 },
  divider: { height: 1, backgroundColor: "#E3342F", marginVertical: 6 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 4, color: "#555" },
  paragraph: { marginBottom: 6 },
  footer: { marginTop: 30, textAlign: "center", fontSize: 10, color: "#555" },
});

const stripMarkdown = (text?: string) =>
  text ? text.replace(/\*\*/g, "") : "";

const PDFTraditional: React.FC<PDFTraditionalProps> = ({ risala }) => {
  if (!risala) return null;

  const { raw_data, generated_risala } = risala;

  // ✅ Normalize text and remove ALL stars at once
  const normalizedText =
    generated_risala
      ?.replace(/\r/g, "")        // Remove carriage returns
      .replace(/\*\*/g, "")       // Remove double stars
      .replace(/\*/g, "")         // Remove any remaining single stars
      .trim() || "";

  const paragraphs = normalizedText.split("\n");

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

        {/* GUEST INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taarifa za Wageni</Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: "bold" }}>Mgeni Rasmi: </Text>
            {raw_data.guest_of_honor || "—"} <Text>({raw_data.guest_title || "Cheo hakijatajwa"})</Text>
          </Text>
          <Text style={styles.paragraph}>
            <Text style={{ fontWeight: "bold" }}>Shirika: </Text>
            {raw_data.organization_name || "—"}
            {raw_data.organization_representative && ` — Mwakilishi: ${raw_data.organization_representative}`}
          </Text>
        </View>

        {/* PURPOSE & BACKGROUND */}
        {raw_data.purpose_statement && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Madhumuni ya Risala</Text>
            <Text style={styles.paragraph}>{raw_data.purpose_statement}</Text>
          </View>
        )}
        {raw_data.background_info && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historia Fupi</Text>
            <Text style={styles.paragraph}>{raw_data.background_info}</Text>
          </View>
        )}

        {/* MAIN RISALA BODY */}
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

export default PDFTraditional;
