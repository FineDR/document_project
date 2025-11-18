import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TraditionalTemplate from "../components/templates/cv-templates/TraditionalTemplate";
import AdvancedTemplate from "../components/templates/cv-templates/AdvancedTemplate";
import IntermediateTemplate from "../components/templates/cv-templates/IntermediateTemplate";
import { AiOutlineClose } from "react-icons/ai";

import { CV_TEMPLATE_CATEGORIES } from "../constant/cvTemplateCategories";
import Button from "../components/formElements/Button";
import PaymentComponent from "../components/sections/PaymentComponent";
import { getBasicPDF, getIntermediatePDF, getAdvancedPDF } from "../features/downloads/downloadsSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

interface TemplateProps {
  isPreview?: boolean;
}

const CVTemplates = () => {
  const [payments, setPayments] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTemplate, setSelectedTemplate] = useState<React.ComponentType<{ isPreview?: boolean }> | null>(null);

  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const templateMap: Record<string, React.ComponentType<TemplateProps>> = {
    Basic: TraditionalTemplate,
    Intermediate: IntermediateTemplate,
    Advanced: AdvancedTemplate,
  };

  const handleDownload = (templateName: string) => {
    let thunk;
    switch (templateName) {
      case "Basic":
        thunk = getBasicPDF();
        break;
      case "Intermediate":
        thunk = getIntermediatePDF();
        break;
      case "Advanced":
        thunk = getAdvancedPDF();
        break;
      default:
        return;
    }
    dispatch(thunk)
      .unwrap()
      .then((blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `My_CV_${templateName}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((err) => console.error("Download failed:", err));
  };

  return (
    <main className="mt-10 w-full border-t min-h-screen mb-8">
      <div className="container mx-auto">
        <div className="prose prose-professional text-center">
          <h1 className="text-h1 mt-14">CV Template Options</h1>
          <p className="text-subHeadingGray">
            Choose from professional templates and preview your CV before downloading.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {CV_TEMPLATE_CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              className="p-4 border rounded-xl shadow hover:shadow-lg transition duration-300 mt-4 bg-whiteBg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-96 overflow-auto p-3 flex flex-col bg-redBg/10 rounded-lg shadow-inner">
                {React.createElement(templateMap[category.name], { isPreview: true })}
              </div>

              <div className="flex justify-between items-center p-4">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <Button
                  onClick={() => {
                    const Component = templateMap[category.name];
                    setSelectedTemplateName(category.name);
                    setSelectedTemplate(() => Component);
                    setModalOpen(true);
                    setPaymentSuccess(false);
                  }}
                  type="button"
                  name="Preview"
                  label="Preview"
                />
              </div>

              <p className="text-gray-600 p-4">{category.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && selectedTemplate && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                className="relative grid grid-cols-1 sm:grid-cols-[70%_30%] gap-4 w-full sm:w-[90%] max-w-[1200px] h-full sm:h-[90%] bg-whiteBg rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden light-theme"
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
              >

                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 z-50 text-gray-500 hover:text-gray-700"
                  onClick={() => setModalOpen(false)}
                >
                  <AiOutlineClose size={24} className="text-redMain" />
                </button>

                {/* Template Preview */}
                {selectedTemplate && React.createElement(selectedTemplate, { isPreview: true, })}


                {/* Template Details & Action */}
                <div className="overflow-auto bg-gray-50 rounded-xl p-4 sm:p-6 h-96 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Template Details</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      This CV template offers a clean and professional layout to make a strong first impression.
                    </p>

                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        💡 Click <span className="font-semibold">"Use Template"</span> to personalize and download. Payment is required for full access.
                      </p>
                    </div>
                  </div>

                  {!paymentSuccess ? (
                    <Button
                      onClick={() => setPaymentSuccess(true)}
                      type="submit"
                      name="Use Template"
                      label="Use Template"
                      className="hover:!bg-[#F87171]  hover:!text-white"
                    />
                  ) : (
                    <Button
                      onClick={() => handleDownload(selectedTemplateName ?? "Basic")}
                      type="button"
                      name="Download Template"
                      label="Download Your CV"
                      className=" hover:!text-white hover:!bg-[#F87171]"
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Payment Component */}
        <AnimatePresence>
          {payments && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-whiteBg w-[90%] max-w-md p-6 rounded-lg shadow-lg relative"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
              >
                <PaymentComponent onSuccess={() => {
                  setPaymentSuccess(true);
                  setPayments(false);
                }} />
                <button
                  onClick={() => setPayments(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-redMain"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default CVTemplates;
