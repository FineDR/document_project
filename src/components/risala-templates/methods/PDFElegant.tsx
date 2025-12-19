import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { RisalaData } from "../../../types/risalaTypes";

// Register Times New Roman font
Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/fonts/Times_New_Roman.ttf" },
    { src: "/fonts/Times_New_Roman_Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Times_New_Roman_Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Times_New_Roman_Bold_Italic.ttf", fontWeight: "bold", fontStyle: "italic" },
  ],
});

interface PDFElegantProps {
  risala: RisalaData;
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineHeight: 1.5,
    width: "210mm",
    minHeight: "297mm",
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#E3342F", // Tailwind redMain
  },
  subtitle: {
    fontSize: 10,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  divider: {
    height: 2,
    backgroundColor: "#E3342F",
    marginVertical: 8,
    borderRadius: 2,
  },
  card: {
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#E3342F",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#FFF5F5",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#555",
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


const PDFElegant: React.FC<PDFElegantProps> = ({ risala }) => {
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

        {/* GUEST & ORGANIZATION */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Mgeni Rasmi</Text>
              <Text>{raw_data.guest_of_honor || "—"}</Text>
              <Text style={{ fontSize: 10 }}>({raw_data.guest_title || "Cheo hakijatajwa"})</Text>
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
          <View style={{ marginBottom: 12 }}>
            <Text style={{ ...styles.sectionTitle, fontSize: 16, marginBottom: 8, color: "#E3342F" }}>
              Risala Kamili
            </Text>
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

export default PDFElegant;
