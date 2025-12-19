import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineCheckCircle,
  AiOutlineFilePdf
} from "react-icons/ai";

// Templates
import TraditionalTemplate from "../components/templates/cv-templates/TraditionalTemplate";
import AdvancedTemplate from "../components/templates/cv-templates/AdvancedTemplate";
import IntermediateTemplate from "../components/templates/cv-templates/IntermediateTemplate";
import ModernSidebarTemplate from "../components/templates/cv-templates/ModernSidebarTemplate"; // Import the new template
import MinimalistTemplate from "../components/templates/cv-templates/MinimalistTemplate";
import CreativeHeaderTemplate from "../components/templates/cv-templates/CreativeHeaderTemplate";
import CVAdvancedPDF from "../components/templates/cv-templates/cv-methods/CVAdvancedPDF";
import CVIntermediatePDF from "../components/templates/cv-templates/cv-methods/CVIntermediatePDF";
import CVMinimalPDF from "../components/templates/cv-templates/cv-methods/CVMinimalPDF";
import CVModernPDF from "../components/templates/cv-templates/cv-methods/CVModernPDF";
import CVTraditionalPDF from "../components/templates/cv-templates/cv-methods/CVTraditionalPDF";
import CVCreativePDF from "../components/templates/cv-templates/cv-methods/CVCreativePDF";
// Components & Constants
import { CV_TEMPLATE_CATEGORIES } from "../constant/cvTemplateCategories";
import Button from "../components/formElements/Button";
import PaymentComponent from "../components/sections/PaymentComponent";

// Redux
// Note: You might need to create a 'getModernPDF' action in your slice if the backend endpoint differs
// import { getBasicPDF, getIntermediatePDF, getAdvancedPDF } from "../features/downloads/downloadsSlice";
import type { AppDispatch } from "../store/store";
import { PDFDownloadLink, pdf,type DocumentProps } from "@react-pdf/renderer";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

// --- CONFIGURATION ---
const PAYMENT_ENABLED = false;

interface TemplateProps {
  isPreview?: boolean;
}

interface CVPDFProps {
  isPreview?: boolean;
  user?: any; // or whatever data your PDF needs
}

const pdfTemplateMap: Record<string, React.ComponentType<CVPDFProps & DocumentProps>> = {
  Basic: CVTraditionalPDF,
  Modern: CVModernPDF,
  Intermediate: CVIntermediatePDF,
  Advanced: CVAdvancedPDF,
  Minimalist: CVMinimalPDF,
  Creative: CVCreativePDF,
};


const CVTemplates = () => {
  const dispatch = useDispatch<AppDispatch>();

  // --- State ---
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);

  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<React.ComponentType<TemplateProps> | null>(null);


  const user = useSelector((state: RootState) => state.auth.user);
  const [isDownloading, setDownloading] = useState(false);

  // MAPPING: Keys here must match 'name' in CV_TEMPLATE_CATEGORIES
  const templateMap: Record<string, React.ComponentType<TemplateProps>> = {
    Basic: TraditionalTemplate,
    Intermediate: IntermediateTemplate,
    Advanced: AdvancedTemplate,
    Modern: ModernSidebarTemplate, // Key matches the new constant name
    Minimalist: MinimalistTemplate,
    Creative: CreativeHeaderTemplate,
  };

  // --- Effects ---
  useEffect(() => {
    if (isPreviewModalOpen || isPaymentModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isPreviewModalOpen, isPaymentModalOpen]);

  // --- Handlers ---
  const openPreview = (name: string) => {
    setSelectedTemplateName(name);
    // Safety check in case the map key doesn't exist
    const TemplateComponent = templateMap[name] || TraditionalTemplate;
    setSelectedTemplate(() => TemplateComponent);
    setPreviewModalOpen(true);

    if (!PAYMENT_ENABLED) {
      setPaymentSuccess(true);
    } else {
      setPaymentSuccess(false);
    }
  };

 

  const handleDownload = async (templateName: string) => {
    setDownloading(true);
    try {
      const PDFComponent = pdfTemplateMap[templateName] || CVTraditionalPDF;
      const blob = await pdf(<PDFComponent />).toBlob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `My_CV_${templateName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-background transition-colors duration-300 pb-20 pt-10 border-t border-subHeadingGray/10">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header Section */}
        <div className="prose prose-lg mx-auto text-center mb-8 md:mb-12 mt-16 max-w-3xl">
          <h1 className="text-3xl md:text-h1 font-bold text-redMain mb-4">
            CV Template Options
          </h1>
          <p className="text-subHeadingGray text-base md:text-lg">
            Choose from professional templates and preview your CV before downloading.
            Optimized for ATS and designed for impact.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CV_TEMPLATE_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              className="group relative bg-background border border-subHeadingGray/20 rounded-xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col"
              whileHover={{ y: -5 }}
            >
              {/* Thumbnail Area */}
              <div
                className="relative h-64 md:h-72 bg-subHeadingGray/5 overflow-hidden cursor-pointer"
                onClick={() => openPreview(category.name)}
              >
                {/* Scaled Preview */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[210mm] origin-top transform scale-[0.3] md:scale-[0.4] shadow-md pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity mt-4">
                  <div className="light-theme">
                    {/* Safety check: ensure component exists before creating element */}
                    {templateMap[category.name] && React.createElement(templateMap[category.name], { isPreview: true })}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <button className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
                    <AiOutlineEye size={20} className="text-redMain" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-text">{category.name}</h3>
                    <span className="text-xs font-bold px-2 py-1 bg-redMain/10 text-redMain rounded border border-redMain/20">
                      {PAYMENT_ENABLED ? "PRO" : "FREE"}
                    </span>
                  </div>
                  <p className="text-subHeadingGray text-sm line-clamp-3 mb-4 leading-relaxed">
                    {category.description || "A professional template designed to highlight your strengths."}
                  </p>
                </div>

                <Button
                  onClick={() => openPreview(category.name)}
                  type="button"
                  name="Preview Template"
                  label="View Template"
                  className="w-full !rounded-lg border-2 border-transparent hover:border-redMain/20 active:scale-95 transition-transform"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      <AnimatePresence>
        {isPreviewModalOpen && selectedTemplate && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewModalOpen(false)}
          >
            <motion.div
              className="relative w-full h-full md:h-[90vh] max-w-7xl bg-background md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-subHeadingGray/20"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
            >

              <button
                className="absolute top-4 right-4 z-50 p-2 bg-white text-redMain rounded-full shadow-lg md:hidden border border-gray-200"
                onClick={() => setPreviewModalOpen(false)}
              >
                <AiOutlineClose size={20} />
              </button>

              <div className="flex-1 bg-subHeadingGray/10 overflow-y-auto custom-scrollbar relative flex justify-center">
                <div className="py-8 px-2 md:px-4 min-h-full">
                  <div className="bg-white shadow-[0_0_30px_rgba(0,0,0,0.1)] w-full max-w-[210mm] min-h-[297mm]">
                    <div className="light-theme text-gray-800">
                      {React.createElement(selectedTemplate, { isPreview: true })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 lg:w-96 bg-background border-t md:border-t-0 md:border-l border-subHeadingGray/20 flex flex-col z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none">

                <div className="p-6 border-b border-subHeadingGray/20 hidden md:flex justify-between items-center">
                  <h2 className="text-xl font-bold text-text">Details</h2>
                  <button onClick={() => setPreviewModalOpen(false)} className="text-subHeadingGray hover:text-redMain transition">
                    <AiOutlineClose size={24} />
                  </button>
                </div>

                <div className="p-4 md:p-6 flex-1 overflow-y-auto hidden md:block">
                  <h3 className="font-semibold text-xl md:text-2xl text-redMain mb-2">{selectedTemplateName}</h3>
                  <div className="h-1 w-12 bg-subHeadingGray/20 mb-4 rounded-full"></div>

                  <p className="text-subHeadingGray text-sm mb-6 leading-relaxed">
                    This ATS-friendly layout ensures your skills are parsed correctly by hiring software while maintaining a clean, professional aesthetic for human readers.
                  </p>

                  <div className="bg-subHeadingGray/5 border border-subHeadingGray/10 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <AiOutlineFilePdf className="text-redMain mt-1" size={24} />
                      <div>
                        <p className="text-sm font-semibold text-text">Ready for Download</p>
                        <p className="text-xs text-subHeadingGray mt-1">
                          Export directly to high-quality PDF format.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 border-t border-subHeadingGray/20 bg-background md:bg-subHeadingGray/5 pb-8 md:pb-6">
                  <h3 className="font-bold text-lg text-text mb-2 md:hidden">{selectedTemplateName} Template</h3>

                  <div className="flex flex-col gap-3">
                    {PAYMENT_ENABLED && !paymentSuccess ? (
                      <div className="text-center mb-1">
                        <span className="text-xs text-subHeadingGray uppercase tracking-wider">Premium Template</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 justify-center mb-2 text-sm font-medium">
                        <AiOutlineCheckCircle />
                        {PAYMENT_ENABLED ? "License Active" : "Free Access"}
                      </div>
                    )}

                    {selectedTemplateName && (
                      <PDFDownloadLink
                        document={React.createElement(pdfTemplateMap[selectedTemplateName], { user })}
                        fileName={`My_CV_${selectedTemplateName}.pdf`}
                      >
                        {({ loading }) => (
                          <button className="w-full py-3 md:py-4 text-base md:text-lg shadow-lg hover:shadow-xl transition-all rounded-xl active:scale-95 bg-green-600 hover:bg-green-700 text-white">
                            {loading ? "Generating PDF..." : "Download PDF"}
                          </button>
                        )}
                      </PDFDownloadLink>

                    )}

                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {isPaymentModalOpen && PAYMENT_ENABLED && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background w-full max-w-md rounded-2xl shadow-2xl border border-subHeadingGray/20 overflow-hidden relative"
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
            >
              <div className="bg-subHeadingGray/5 px-6 py-4 border-b border-subHeadingGray/10 flex justify-between items-center">
                <h3 className="font-bold text-text">Complete Access</h3>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="text-subHeadingGray hover:text-redMain transition"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <div className="p-6">
                <PaymentComponent onSuccess={() => {
                  setPaymentSuccess(true);
                  setPaymentModalOpen(false);
                }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default CVTemplates;