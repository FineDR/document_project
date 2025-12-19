import React, { useState, useEffect } from "react";
import TraditionalTemplate from "../components/risala-templates/TraditionalTemplate";
import ModernTemplate from "../components/risala-templates/ModernTemplate";
import ElegantTemplate from "../components/risala-templates/ElegantTemplate";
import MinimalTemplate from "../components/risala-templates/MinimalTemplate";
import ProfessionalTemplate from "../components/risala-templates/ProfessionalTemplate";
import CreativeTemplate from "../components/risala-templates/CreativeTemplate";
import { fetchRisala } from "../features/risala/risalaSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import type { RootState } from "../store/store";
import type { RisalaData } from "../types/risalaTypes";
import Button from "../components/formElements/Button";

import PDFTraditional from "../components/risala-templates/methods/PDFTraditional";
import PDFMinimal from "../components/risala-templates/methods/PDFMinimal";
import PDFModern from "../components/risala-templates/methods/PDFModern";
import PDFElegant from "../components/risala-templates/methods/PDFElegant";
import PDFProfessional from "../components/risala-templates/methods/PDFProfessional";
import PDFCreative from "../components/risala-templates/methods/PDFCreative";

import { PDFDownloadLink, type DocumentProps } from "@react-pdf/renderer";

interface TemplateOption {
  name: string;
  component: React.ComponentType<{ isPreview?: boolean }>;
  description?: string;
}

type TemplateName =
  | "Traditional"
  | "Minimal"
  | "Modern"
  | "Elegant"
  | "Professional"
  | "Creative";

const PDF_TEMPLATES: Record<
  TemplateName,
  React.ComponentType<{ risala: RisalaData } & DocumentProps>
> = {
  Traditional: PDFTraditional,
  Minimal: PDFMinimal,
  Modern: PDFModern,
  Elegant: PDFElegant,
  Professional: PDFProfessional,
  Creative: PDFCreative,
};

const TEMPLATES: TemplateOption[] = [
  { name: "Traditional", component: TraditionalTemplate, description: "A professionally structured and elegant classic risala layout." },
  { name: "Minimal", component: MinimalTemplate, description: "A clean, modern, and distraction-free risala layout with soft accents." },
  { name: "Modern", component: ModernTemplate, description: "A contemporary, clean, and professional risala layout with accent highlights." },
  { name: "Elegant", component: ElegantTemplate, description: "A minimalist, professional, and visually elegant risala layout with accent borders." },
  { name: "Professional", component: ProfessionalTemplate, description: "A formal, professional, and visually structured risala layout with accent borders." },
  { name: "Creative", component: CreativeTemplate, description: "A vibrant, creative risala layout with colorful accents and interactive elements." },
];

const RisalaTemplate: React.FC = () => {
  const dispatch = useAppDispatch();
  const risalaData = useAppSelector((state: RootState) => state.risala.data);

  const risalaArray: RisalaData[] = risalaData
    ? Array.isArray(risalaData)
      ? risalaData
      : [risalaData]
    : [];

  const [activeEventType, setActiveEventType] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!risalaData) dispatch(fetchRisala());
  }, [dispatch, risalaData]);

  useEffect(() => {
    if (risalaArray.length > 0 && !activeEventType) {
      setActiveEventType(risalaArray[0].raw_data.event_type || null);
    }
  }, [risalaArray, activeEventType]);

  const openPreview = (template: TemplateOption) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedTemplate(null);
    setPreviewOpen(false);
  };

  if (!risalaArray.length) {
    return <p className="text-subheading mt-20 text-center">Loading risala data...</p>;
  }

  const eventTypes = Array.from(new Set(risalaArray.map((r) => r.raw_data.event_type)));
  const filteredRisalas = risalaArray.filter((r) => r.raw_data.event_type === activeEventType);

  return (
    <div className="container mx-auto bg-background text-text min-h-screen transition-colors duration-300 mt-14 px-4">
      <h1 className="text-h1 mb-8 text-primary text-center">Chagua Muundo wa Risala</h1>

      {/* Event Type Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              activeEventType === type
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-subheading hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() => setActiveEventType(type ?? null)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Risala Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRisalas.map((r, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl opacity-0 animate-fadeIn"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
          >
            <h2 className="text-xl font-semibold text-primary mb-2">{r.raw_data.event_title}</h2>
            <p className="text-sm text-subheading">{r.raw_data.event_type}</p>
            <p className="text-subheading text-xs mt-1">{r.raw_data.event_date}</p>

            {/* Template Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  className="px-3 py-1 bg-redMain text-white rounded-lg text-xs hover:bg-red-600 transition"
                  onClick={() => openPreview(template)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closePreview}>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-[85vw] w-full p-6 overflow-y-auto max-h-[95vh] border border-gray-200 dark:border-gray-700 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-redMain font-bold text-xl hover:text-red-700 transition"
              onClick={closePreview}
            >
              ✕
            </button>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mb-4 me-14">
              <Button
                label="Copy Text"
                onClick={() => {
                  if (!risalaData?.generated_risala) return;
                  navigator.clipboard.writeText(risalaData.generated_risala);
                  alert("Risala imekopishwa kwenye clipboard!");
                }}
              />

              {/* PDF Download */}
              {selectedTemplate && risalaData && selectedTemplate.name in PDF_TEMPLATES && (
                <PDFDownloadLink
                  document={React.createElement(PDF_TEMPLATES[selectedTemplate.name as TemplateName], { risala: risalaData })}
                  fileName={`${risalaData.raw_data.event_title || "risala"}.pdf`}
                >
                  {({ loading }) => (
                    <button className="px-3 py-1 bg-redMain text-white rounded-lg text-xs hover:bg-red-600 transition">
                      {loading ? "Inatengeneza PDF..." : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
              )}
            </div>

            {/* Display Template Preview */}
            <selectedTemplate.component isPreview />
          </div>
        </div>
      )}
    </div>
  );
};

export default RisalaTemplate;
