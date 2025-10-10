import { useState } from "react";
import React from "react";
import TraditionalTemplate from "../components/templates/cv-templates/TraditionalTemplate";
import AdvancedTemplate from "../components/templates/cv-templates/AdvancedTemplate";
import IntermediateTemplate from "../components/templates/cv-templates/IntermediateTemplate";
import { AiOutlineClose } from "react-icons/ai";

import { CV_TEMPLATE_CATEGORIES } from "../constant/cvTemplateCategories";
import Button from "../components/formElements/Button"
import PaymentComponent from "../components/sections/PaymentComponent";
interface TemplateProps {
  isPreview?: boolean;
}

const CVTemplates = () => {
  const [payments, setPayments] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false); 

  const [selectedTemplate, setSelectedTemplate] = useState<React.ComponentType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const templateMap: Record<string, React.ComponentType<TemplateProps>> = {
    Basic: TraditionalTemplate,
    Intermediate: IntermediateTemplate,
    Advanced: AdvancedTemplate,
  };

   const handleDownload = () => {
    alert("🎉 Download started! You can now download your personalized CV template.");
  };

  return (
    <main className="mt-10 w-full border-t min-h-screen mb-8">
      <h2 className="mt-4 text-2xl font-bold text-red-600 text-center">CV Template Options</h2>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {CV_TEMPLATE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="p-4 border rounded-xl shadow hover:shadow-lg transition duration-300 mt-4"
            >
              <div className="h-96 bg-white shadow-inner overflow-auto p-3 flex flex-col">
                {React.createElement(templateMap[category.name], { isPreview: true })}
              </div>


              <div className="flex justify-between p-4">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <Button
                  onClick={() => {
                    // Pick the component based on category name
                    const Component = templateMap[category.name];
                    setSelectedTemplate(() => Component);
                    setModalOpen(true);
                  }}
                  type="button"
                  name="Preview"
                  label="Preview"
                />
              </div>
              <p className="text-gray-600 p-4">{category.description}</p>

            </div>
          ))}
        </div>
        {isModalOpen && selectedTemplate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="relative grid grid-cols-[80%_20%] gap-4 w-[90%] max-w-[1200px] h-[90%] bg-white rounded-xl shadow-lg p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-50 text-gray-500 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                <AiOutlineClose size={24} className="text-red-600" />
              </button>

              <div className="overflow-auto p-4 rounded-lg shadow-inner bg-white">
                {React.createElement(selectedTemplate)}
              </div>

              <div className="overflow-auto bg-gray-50 rounded-xl p-6 mt-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">Template Details</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This CV template offers a clean and professional layout, helping you make a strong first impression.
                  </p>

                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      💡 To personalize and download this template, click <span className="font-semibold">"Use Template"</span>.
                      A quick payment step will follow before full access is granted.
                    </p>
                  </div>
                </div>

                 {!paymentSuccess ? (
                  <Button
                    onClick={() => 
                      setPayments(true)
                      // setPaymentSuccess(true)
                    }
                    type="submit"
                    name="Use Template"
                    label="Use Template"
                    className="mt-6 bg-green-600 text-white w-full px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  />
                ) : (
                  <Button
                    onClick={handleDownload}
                    type="button"
                    name="Download Template"
                    label="Download Your CV"
                    className="mt-6 bg-blue-600 text-white w-full px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  />
                )}
              </div>


            </div>
          </div>
        )}


      </div>
      {payments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
              <PaymentComponent onSuccess={() => {
              setPaymentSuccess(true);
              setPayments(false);
            }} />
            <button
              onClick={() => setPayments(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      

    </main>
  );

}
export default CVTemplates