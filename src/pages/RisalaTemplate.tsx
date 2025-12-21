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
import { useNavigate } from "react-router-dom";

interface TemplateOption {
  name: string;
  component: React.ComponentType<{ isPreview?: boolean }>;
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
  { name: "Traditional", component: TraditionalTemplate },
  { name: "Minimal", component: MinimalTemplate },
  { name: "Modern", component: ModernTemplate },
  { name: "Elegant", component: ElegantTemplate },
  { name: "Professional", component: ProfessionalTemplate },
  { name: "Creative", component: CreativeTemplate },
];

const RisalaTemplate: React.FC = () => {
  const dispatch = useAppDispatch();
  const risalaData = useAppSelector(
    (state: RootState) => state.risala.data
  );
  const navigate = useNavigate();

  const risalaArray: RisalaData[] = risalaData
    ? Array.isArray(risalaData)
      ? risalaData
      : [risalaData]
    : [];

  const [activeEventType, setActiveEventType] =
    useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateOption | null>(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (risalaData === undefined) dispatch(fetchRisala());
  }, [dispatch, risalaData]);

  useEffect(() => {
    if (risalaArray.length && !activeEventType) {
      setActiveEventType(
        risalaArray[0].raw_data.event_type || null
      );
    }
  }, [risalaArray, activeEventType]);

  const handleOnclick = () => {
    navigate("/create/risala");
  };
  /* -------------------- LOADING -------------------- */
  if (risalaData === undefined) {
    return (
      <p className="text-center mt-24 text-subheading">
        Inapakia taarifa za risala. Tafadhali subiri…
      </p>
    );
  }

  /* -------------------- EMPTY STATE (CARD ONLY) -------------------- */
  if (!risalaData || risalaArray.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background px-4">
        <div className="max-w-md w-full bg-background border border-subheading rounded-2xl p-8 shadow-sm text-center animate-fadeIn">
          <h2 className="text-h2 text-primary mb-3">
            Hakuna Taarifa za Risala
          </h2>

          <p className="text-base text-subheading mb-4">
            Ili kuendelea, tafadhali jaza kwanza taarifa muhimu
            za tukio na risala.
          </p>

          <p className="text-base text-subheading mb-6">
            Baada ya kujaza taarifa hizi, utaweza kuchagua
            muundo wa risala na kupakua PDF.
          </p>

          <Button label="Jaza Taarifa za Risala" onClick={handleOnclick} />
        </div>
      </div>
    );
  }

  const eventTypes = Array.from(
    new Set(risalaArray.map(r => r.raw_data.event_type))
  );

  const filteredRisalas = risalaArray.filter(
    r => r.raw_data.event_type === activeEventType
  );

  return (
    <div className="container mx-auto bg-background text-text min-h-screen mt-14 px-4">
      <h1 className="text-h1 mb-8 text-primary text-center">
        Chagua Muundo wa Risala
      </h1>

      {/* EVENT TYPE TABS */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {eventTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveEventType(type ?? null)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeEventType === type
                ? "bg-redMain text-white"
                : "bg-background border border-subheading text-subheading hover:bg-redMain/10"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* RISALA CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRisalas.map((r, idx) => (
          <div
            key={idx}
            className="bg-background border border-subheading rounded-2xl p-6 shadow-sm hover:shadow-lg transition animate-fadeIn"
          >
            <h2 className="text-h2 text-primary mb-2">
              {r.raw_data.event_title}
            </h2>
            <p className="text-base text-subheading">
              {r.raw_data.event_date}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {TEMPLATES.map(template => (
                <button
                  key={template.name}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setPreviewOpen(true);
                  }}
                  className="px-3 py-1 bg-redMain text-white rounded-lg text-xs hover:opacity-90 transition"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {isPreviewOpen && selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-background text-text rounded-xl shadow-2xl max-w-[85vw] w-full p-6 overflow-y-auto max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-xl font-bold text-primary"
              onClick={() => setPreviewOpen(false)}
            >
              ✕
            </button>

            <div className="flex justify-end gap-2 mb-4">
              <Button
                label="Copy Text"
                disabled={!risalaData.generated_risala}
                onClick={() =>
                  navigator.clipboard.writeText(
                    risalaData.generated_risala || ""
                  )
                }
              />

              {selectedTemplate.name in PDF_TEMPLATES && (
                <PDFDownloadLink
                  document={React.createElement(
                    PDF_TEMPLATES[
                      selectedTemplate.name as TemplateName
                    ],
                    { risala: risalaData }
                  )}
                  fileName="risala.pdf"
                >
                  {({ loading }) => (
                    <button
                      className="px-3 py-1 bg-redMain text-white rounded-lg text-xs"
                      disabled={!risalaData.generated_risala}
                    >
                      {loading
                        ? "Inatengeneza PDF…"
                        : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
              )}
            </div>

            <selectedTemplate.component isPreview />
          </div>
        </div>
      )}
    </div>
  );
};

export default RisalaTemplate;
