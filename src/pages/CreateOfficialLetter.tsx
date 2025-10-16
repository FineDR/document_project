/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  FaUser,
  FaFileAlt,
  FaEye,
  FaArrowLeft,
  FaCheck,
  FaArrowRight,
  FaExclamationTriangle,
  FaSpinner,
  FaSave,
  FaDownload,
  FaInfoCircle,
  FaMagic,
} from 'react-icons/fa';
import InputField from "../components/formElements/InputField";
import Button from "../components/formElements/Button";
import Loader from "../components/common/Loader";
import { generateCleanLetter, type LetterResponse } from "../api/letterAI";

// Updated schema to include recipientAddress
const officialLetterSchema = z.object({
  // Recipient details - minimal necessary information
  recipient: z.string().min(1, "Recipient name is required"),
  recipientTitle: z.string().min(1, "Recipient title is required"),
  recipientAddress: z.string().min(1, "Recipient address is required"),

  // Letter purpose - minimal necessary information
  purpose: z.string().min(1, "Letter purpose is required"),

  // Sender details - minimal necessary information
  senderName: z.string().min(1, "Your full name is required"),
  senderPhone: z.string().min(1, "Phone number is required"),
});

type FormLetterFields = z.infer<typeof officialLetterSchema>;

// Letter templates with improved typography and clean underline
const letterTemplates = [
  {
    id: 'classic',
    name: 'Classic Business',
    description: 'Traditional business letter format',
    render: (values: FormLetterFields, generatedContent: LetterResponse) => (
      <div className="bg-whiteBg p-10 border border-gray-300 rounded-lg shadow-md" style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.5' }}>
        <div className="mb-8 text-right">
          <p className="text-gray-800">{values.senderName}</p>
          <p className="text-gray-800">{values.senderPhone}</p>
          <p className="text-gray-800">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="mb-8">
          <p className="text-gray-800">{values.recipientTitle}</p>
          <p className="text-gray-800 font-semibold">{values.recipient}</p>
          <p className="text-gray-800">{generatedContent.recipientAddress}</p>
        </div>
        <div className="mb-8">
          <div className="pb-2 border-b-2 border-gray-800 inline-block">
            <p className="text-gray-800 font-bold">Subject: {generatedContent.subject}</p>
          </div>
        </div>
        <div className="mb-8">
          <p className="text-gray-800 whitespace-pre-line">{generatedContent.content}</p>
        </div>
        <div className="mb-6">
          <p className="text-gray-800">{generatedContent.closing}</p>
          <p className="text-gray-800 font-semibold mt-4">{values.senderName}</p>
        </div>
      </div>
    )
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with subtle styling',
    render: (values: FormLetterFields, generatedContent: LetterResponse) => (
      <div className="bg-whiteBg p-10 border-l-4 border-blue-500 rounded-lg shadow-md" style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.5' }}>
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-700 text-sm uppercase tracking-wider">To:</p>
              <p className="text-gray-900 font-bold text-lg">{values.recipient}</p>
              <p className="text-gray-800">{values.recipientTitle}</p>
              <p className="text-gray-800">{generatedContent.recipientAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 text-sm uppercase tracking-wider">From:</p>
              <p className="text-gray-900 font-bold text-lg">{values.senderName}</p>
              <p className="text-gray-800">{values.senderPhone}</p>
              <p className="text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="pb-2 border-b-2 border-blue-500 inline-block">
            <h2 className="text-xl font-bold text-gray-900">{generatedContent.subject}</h2>
          </div>
        </div>
        <div className="mb-10">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">{generatedContent.content}</p>
        </div>
        <div className="flex justify-end">
          <div>
            <p className="text-gray-800">{generatedContent.closing}</p>
            <p className="text-gray-900 font-bold text-lg mt-2">{values.senderName}</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'formal',
    name: 'Formal Block',
    description: 'Traditional block format with formal styling',
    render: (values: FormLetterFields, generatedContent: LetterResponse) => (
      <div className="bg-whiteBg p-12 border-2 border-gray-800 rounded-lg shadow-lg" style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.5' }}>
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-serif font-bold text-gray-900 uppercase tracking-wider">Official Correspondence</h1>
          <div className="w-32 h-1 bg-gray-800 mx-auto mt-3"></div>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 text-sm font-semibold uppercase tracking-wider mb-2">Recipient</p>
              <p className="text-gray-900 font-bold">{values.recipient}</p>
              <p className="text-gray-800">{values.recipientTitle}</p>
              <p className="text-gray-800">{generatedContent.recipientAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 text-sm font-semibold uppercase tracking-wider mb-2">Sender</p>
              <p className="text-gray-900 font-bold">{values.senderName}</p>
              <p className="text-gray-800">{values.senderPhone}</p>
              <p className="text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-block">
            <div className="pb-2 border-b-2 border-gray-800">
              <p className="text-gray-900 font-bold uppercase tracking-wider">Subject: {generatedContent.subject}</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed text-justify">{generatedContent.content}</p>
        </div>

        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-gray-800">{generatedContent.closing}</p>
            <p className="text-gray-900 font-bold mt-3">{values.senderName}</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, clean design with minimal elements',
    render: (values: FormLetterFields, generatedContent: LetterResponse) => (
      <div className="bg-whiteBg p-10 rounded-lg shadow-sm" style={{ fontFamily: 'Times New Roman, serif', fontSize: '12pt', lineHeight: '1.5' }}>
        <div className="mb-10">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-900 font-bold">{values.senderName}</p>
              <p className="text-gray-700 text-sm">{values.senderPhone}</p>
            </div>
            <p className="text-gray-600 text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-gray-800">{values.recipientTitle}</p>
          <p className="text-gray-900 font-bold">{values.recipient}</p>
          <p className="text-gray-800">{generatedContent.recipientAddress}</p>
        </div>

        <div className="mb-8">
          <div className="pb-1 border-b border-gray-400 inline-block">
            <p className="text-gray-900 font-bold">Re: {generatedContent.subject}</p>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">{generatedContent.content}</p>
        </div>

        <div>
          <p className="text-gray-800">{generatedContent.closing}</p>
          <p className="text-gray-900 font-bold mt-3">{values.senderName}</p>
        </div>
      </div>
    )
  }
];

const CreateOfficialLetter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<LetterResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    reset,
  } = useForm<FormLetterFields>({
    resolver: zodResolver(officialLetterSchema),
    mode: "onChange",
  });

  // Watch form values for real-time preview
  const formValues = watch();

  // Function to generate letter with AI - now returns the data
  const generateWithAI = async (): Promise<LetterResponse> => {
    setAiGenerating(true);
    setApiError(null);
    try {
      const letterData = await generateCleanLetter(formValues);
      setGeneratedContent(letterData);
      return letterData;
    } catch (error) {
      console.error("Error generating letter with AI:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setApiError(errorMessage);
      throw error;
    } finally {
      setAiGenerating(false);
    }
  };

  // Function to generate PDF with improved quality
  const generatePDF = async () => {
    if (!letterRef.current || !generatedContent) return;

    setPdfGenerating(true);
    try {
      // Higher quality capture
      const canvas = await html2canvas(letterRef.current, {
        scale: 3, // Increased scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF with a clean filename
      const cleanSubject = generatedContent.subject
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      const fileName = `official-letter-${cleanSubject}.pdf`;
      pdf.save(fileName);

      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("idle");
      }, 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSubmissionStatus("error");
      setTimeout(() => {
        setSubmissionStatus("idle");
      }, 3000);
    } finally {
      setPdfGenerating(false);
    }
  };

  // Navigate to next step with validation
  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate basic information before proceeding
      const isValidStep = await trigger([
        "recipient",
        "recipientTitle",
        "recipientAddress",
        "purpose",
        "senderName",
        "senderPhone",
      ]);

      if (isValidStep) {
        try {
          // Generate letter with AI before moving to next step
          await generateWithAI();
          setCurrentStep(2);
        } catch (error) {
          // Error is already handled in generateWithAI
        }
      }
    } else if (currentStep === 2) {
      // Move to preview
      setCurrentStep(3);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset form
  const resetForm = () => {
    reset();
    setGeneratedContent(null);
    setApiError(null);
  };

  // Submit the form
  const onSubmit: SubmitHandler<FormLetterFields> = async () => {
    setLoading(true);
    setSubmissionStatus("idle");
    try {
      // Generate PDF
      await generatePDF();

      // After showing success, reset
      setTimeout(() => {
        setLoading(false);
        resetForm();
        setCurrentStep(1);
      }, 1500);
    } catch (err) {
      setSubmissionStatus("error");
      setLoading(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { id: 1, name: "Details", icon: <FaUser /> },
      { id: 2, name: "Review", icon: <FaFileAlt /> },
      { id: 3, name: "Preview", icon: <FaEye /> },
    ];
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep === step.id
                    ? "bg-red-600 text-white shadow-lg"
                    : currentStep > step.id
                      ? "bg-red-100 text-red-600 border-2 border-red-600"
                      : "bg-whiteBg text-red-600 border-2 border-red-200"
                  }`}
              >
                {currentStep > step.id ? <FaCheck /> : step.id}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${currentStep === step.id ? "text-red-800" : "text-red-600"
                  }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-red-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render validation errors
  const renderValidationError = (fieldName: keyof FormLetterFields) => {
    const error = errors[fieldName];
    if (!error) return null;
    return (
      <div className="flex items-center mt-1 text-red-600">
        <FaExclamationTriangle className="mr-2" />
        <span className="text-sm">{error.message}</span>
      </div>
    );
  };

  // Render template selector
  const renderTemplateSelector = () => {
    return (
      <div className="mb-6">
        <h4 className="text-md font-semibold text-red-900 mb-3">Choose a Template</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {letterTemplates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedTemplate === template.id
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="font-medium text-red-900">{template.name}</div>
              <div className="text-sm text-gray-600 mt-1">{template.description}</div>
              {selectedTemplate === template.id && (
                <div className="mt-2 text-red-600 text-sm flex items-center">
                  <FaCheck className="mr-1" /> Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-red-900 flex items-center">
                <FaUser className="mr-2" /> Basic Information
              </h3>
              <Button
                type="button"
                label="Reset Form"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 hover:bg-red-700 flex items-center text-sm"
              >
                <FaSave className="mr-2" /> Reset Form
              </Button>
            </div>
            <p className="text-sm text-red-600 mb-4">
              Provide only the essential details. Our AI will generate a complete, professional letter based on this information.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-500 mt-1 mr-2" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How it works:</p>
                  <p>Just fill in the basic information below, and our AI will create a well-structured, professional letter for you. You'll be able to review and customize it before generating the final PDF.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Recipient Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputField
                      type="text"
                      label="Recipient Name *"
                      placeholder="e.g., John Smith"
                      name="recipient"
                      register={register("recipient")}
                      error={errors.recipient?.message}
                    />
                    {renderValidationError("recipient")}
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label="Recipient Title *"
                      placeholder="e.g., Director, HR Department"
                      name="recipientTitle"
                      register={register("recipientTitle")}
                      error={errors.recipientTitle?.message}
                    />
                    {renderValidationError("recipientTitle")}
                  </div>
                </div>
                <div>
                  <InputField
                    type="text"
                    label="Recipient Address *"
                    placeholder="e.g., P.O. Box 245 / S.L.P 245, Dar es Salaam"
                    name="recipientAddress"
                    register={register("recipientAddress")}
                    error={errors.recipientAddress?.message}
                  />

                  {renderValidationError("recipientAddress")}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Letter Purpose</h4>
                <div>
                  <InputField
                    type="text"
                    label="Purpose *"
                    placeholder="e.g., Job application for Marketing Manager position"
                    name="purpose"
                    register={register("purpose")}
                    error={errors.purpose?.message}
                  />
                  {renderValidationError("purpose")}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Your Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputField
                      type="text"
                      label="Your Full Name *"
                      placeholder="e.g., Jane Doe"
                      name="senderName"
                      register={register("senderName")}
                      error={errors.senderName?.message}
                    />
                    {renderValidationError("senderName")}
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label="Phone Number *"
                      placeholder="e.g., +255 123 456 789"
                      name="senderPhone"
                      register={register("senderPhone")}
                      error={errors.senderPhone?.message}
                    />
                    {renderValidationError("senderPhone")}
                  </div>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  <span>{apiError}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                type="button"
                label="Generate Letter"
                onClick={nextStep}
                disabled={aiGenerating}
                className="bg-red-600 text-white hover:bg-red-700 flex items-center"
              >
                {aiGenerating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Generating...
                  </>
                ) : (
                  <>
                    <FaMagic className="mr-2" /> Generate Letter
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-red-900 flex items-center">
                <FaFileAlt className="mr-2" /> Review Generated Letter
              </h3>
              <Button
                type="button"
                label="Regenerate"
                onClick={async () => {
                  try {
                    await generateWithAI();
                  } catch (error) {
                    // Error already handled
                  }
                }}
                disabled={aiGenerating}
                className="bg-purple-600 text-white hover:bg-purple-700 flex items-center text-sm"
              >
                {aiGenerating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Regenerating...
                  </>
                ) : (
                  <>
                    <FaMagic className="mr-2" /> Regenerate
                  </>
                )}
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-500 mt-1 mr-2" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Review and customize:</p>
                  <p>Our AI has generated a complete letter based on your input. You can edit any part of the letter below to better suit your needs.</p>
                </div>
              </div>
            </div>

            {generatedContent && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    value={generatedContent.subject}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    value={generatedContent.recipientAddress}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, recipientAddress: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Letter Content</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    rows={12}
                    value={generatedContent.content}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, content: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    value={generatedContent.closing}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, closing: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                type="button"
                label="Preview Letter"
                onClick={nextStep}
                className="bg-red-600 text-white hover:bg-red-700 flex items-center"
              >
                Preview Letter <FaEye className="ml-2" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-red-900 flex items-center">
              <FaEye className="mr-2" /> Preview Your Letter
            </h3>

            {renderTemplateSelector()}

            <div className="flex justify-center">
              <div ref={letterRef}>
                {generatedContent && letterTemplates.find(t => t.id === selectedTemplate)?.render(formValues, generatedContent)}
              </div>
            </div>

            {submissionStatus === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  <FaCheck className="mr-2" />
                  <span>Official letter created and downloaded successfully!</span>
                </div>
              </div>
            )}
            {submissionStatus === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  <span>
                    Failed to create official letter. Please try again.
                  </span>
                </div>
              </div>
            )}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">
                Ready to generate your official letter?
              </h4>
              <p className="text-red-700">
                Click "Generate Letter" to create a professional PDF document
                with Times New Roman font, 12pt size, and 1.5 line spacing.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
  <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-10 font-sans">
  <div className="max-w-4xl mx-auto">
    {/* Header */}
    <div className="text-center mb-10 prose prose-professional">
      <h1 className="text-h1 font-bold text-redMain mb-2">
        Create Official Letter
      </h1>
      <p className="text-subHeadingGray">
        Provide minimal details and let AI generate a professional letter for you
      </p>
    </div>

    {/* Step Indicator */}
    {renderStepIndicator()}

    {/* Main Content */}
    <div className="bg-whiteBg rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="bg-redBg px-6 py-4 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 rounded-lg text-base font-medium transition-all ${
            currentStep === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-redBg text-redMain hover:bg-red-100"
          }`}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Button
            type="submit"
            onClick={() => {}}
            label={currentStep === 3 ? "Generate Letter" : "Continue"}
            disabled={
              loading || (currentStep === 3 && !isValid) || pdfGenerating || !generatedContent
            }
            className="bg-redMain text-white hover:bg-red-600 flex items-center px-4 py-2 rounded-lg font-medium transition-all"
          >
            {currentStep === 3 ? (
              <>
                {pdfGenerating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Generating...
                  </>
                ) : (
                  <>
                    <FaDownload className="mr-2" /> Generate Letter
                  </>
                )}
              </>
            ) : (
              <>
                Continue <FaArrowRight className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>

    {/* Loader */}
    <Loader loading={loading} message="Generating your official letter..." />
  </div>
</div>

  );
};

export default CreateOfficialLetter;