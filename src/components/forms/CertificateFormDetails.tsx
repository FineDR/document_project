/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationsSchema } from "../forms/cvValidationSchema";
import type { z } from "zod";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import Loader from "../common/Loader";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useAppDispatch as useDispatch } from "../../hooks/reduxHooks";
import { addCertificate, updateCertificat } from "../../features/certificates/certificatesSlice";

import { AIInputModal } from "../modals/AIInputModal";
import { AIPreviewModal } from "../modals/AIPreviewModal";
import { buildAIPromptDynamic } from "../../utils/aiPromptBuilderDynamic";
import { generateCV } from "../../features/auth/authSlice";
import { aiTemplates } from "../../utils/aiTemplates";
type FormFields = z.infer<typeof certificationsSchema>;

interface Props {
  editingCert?: any | null;
  onClose?: () => void;
  onUpdate?: (updatedCert: any) => void;
}

const CertificateFormDetails: React.FC<Props> = ({ editingCert, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const methods = useForm<FormFields>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: { certificates: [{ name: "", issuer: "", date: "" }] },
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = methods;
  const { fields, append, remove, replace } = useFieldArray({ control, name: "certificates" });

  const { withLoader } = useTimedLoader(3000);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  // --- AI States ---
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [aiData, setAIData] = useState<any>(null);
  const [isAILoading, setAILoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<keyof typeof aiTemplates>("certifications");
  // Prefill form if editing
  useEffect(() => {
    if (editingCert) {
      replace([{ ...editingCert }]);
    } else {
      reset({ certificates: [{ name: "", issuer: "", date: "" }] });
    }
  }, [editingCert, replace, reset]);

  /* --------------------------------------------------------
      FORM SUBMIT HANDLER
  -------------------------------------------------------- */
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    const payload = {
      full_name: [user.first_name, user.last_name].filter(Boolean).join(" "),
      email: user.email,
      certificates: data.certificates.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date
      }))
    };
    const certPayload = {
      name: data.certificates[0].name,
      issuer: data.certificates[0].issuer,
      date: data.certificates[0].date,
    };
    await withLoader(async () => {
      setLoading(true);
      const startTime = Date.now();
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        let resultAction;
        let message = "";

        if (editingCert?.id) {
          resultAction = await dispatch(updateCertificat({
            id: editingCert.id,
            data: certPayload
          }));
          if (updateCertificat.fulfilled.match(resultAction)) {
            const updatedCert = resultAction.payload;
            message = "Certificate updated successfully ✅";
            setSuccessMessage(message);
            reset({ certificates: [{ name: "", issuer: "", date: "" }] });
            onUpdate?.(updatedCert);
          } else {
            console.error("Failed to update certificate:", resultAction.payload);
          }
        } else {
          resultAction = await dispatch(addCertificate(payload));
          if (addCertificate.fulfilled.match(resultAction)) {
            const updatedCert = resultAction.payload;
            message = "Certificate added successfully ✅";
            setSuccessMessage(message);
            reset({ certificates: [{ name: "", issuer: "", date: "" }] });
            onUpdate?.(updatedCert);
          } else {
            console.error("Failed to add certificate:", resultAction.payload);
          }
        }

      } catch (err) {
        console.error(err);
      } finally {
        clearInterval(interval);
        setLoading(false);
      }
    });
  };

  /* --------------------------------------------------------
      AI HANDLERS
  -------------------------------------------------------- */
  // --- AI Handler for Certificates ---
  // --- Generate AI Certificates ---
  const handleGenerateCertificatesFromAI = async (instructionText: string) => {
    if (!instructionText) return;
    setAILoading(true);

    try {
      // Build dynamic prompt for 'certifications' section
      const prompt = buildAIPromptDynamic("certifications", { instruction_text: instructionText });

      // Dispatch thunk to request AI-generated CV data
      const resultAction = await dispatch(
        generateCV({
          section: "certifications",
          userData: { instruction_text: prompt }, // ✅ key must be 'instruction_text'
        })
      ).unwrap();

      // Parse the AI response; backend returns { certificates: [...] }
      const parsedData = typeof resultAction === "string" ? JSON.parse(resultAction) : resultAction;

      const certificates = Array.isArray(parsedData.certificates) ? parsedData.certificates : [];

      setAIData({ certificates }); // Keep object for preview modal
      setAIModalOpen(false);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Error generating AI certificates:", err);
    } finally {
      setAILoading(false);
    }
  };

  // --- Accept AI-generated Certificates ---
  const handleAcceptCertificatesAI = () => {
    if (!aiData || !aiData.certificates) return;

    // Populate form with AI-generated certificates
    reset({ certificates: aiData.certificates });
    setSuccessMessage("✅ AI-generated certificates populated. Review before submission.");
    setPreviewOpen(false);
    setAIData(null);
  };

  /* --------------------------------------------------------
      RENDER
  -------------------------------------------------------- */
  return (
    <FormProvider {...methods}>
      <section className="w-full mx-auto p-6 bg-whiteBg border rounded-md shadow-md">
        <h2 className="text-h2 font-semibold text-center mb-4">
          {editingCert ? "Edit Certificate" : "Add Certificate"}
        </h2>

        <p className="text-subHeadingGray text-sm mb-6 text-center">
          Fill in your certificate details. Required fields are marked with *.
        </p>

        {/* AI Button */}
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            label="✨ Autofill with AI"
            onClick={() => setAIModalOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 space-y-4 relative">
              <InputField
                type="text"
                label={`Certificate Name *`}
                placeholder="e.g., AWS Certified Cloud Practitioner"
                name={`certificates.${index}.name`}
                register={register(`certificates.${index}.name`)}
                error={errors.certificates?.[index]?.name?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">
                Enter the official name of the certificate or course you completed.
              </p>

              <InputField
                type="text"
                label="Issuer *"
                placeholder="e.g., Amazon Web Services"
                name={`certificates.${index}.issuer`}
                register={register(`certificates.${index}.issuer`)}
                error={errors.certificates?.[index]?.issuer?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">
                The organization or institution that issued the certificate.
              </p>

              <InputField
                type="date"
                label="Issued Date *"
                name={`certificates.${index}.date`}
                register={register(`certificates.${index}.date`)}
                error={errors.certificates?.[index]?.date?.message}
                disabled={loading}
              />
              <p className="text-gray-400 text-xs italic mt-1">
                Select the date when the certificate was awarded.
              </p>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={loading}
                  className="text-red-500 underline text-sm mt-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="flex flex-wrap gap-3 justify-start">
            <Button
              type="button"
              label="+ Add Certificate"
              onClick={() => append({ name: "", issuer: "", date: "" })}
              disabled={loading}
              className="text-white mx-4"
            />
            <Button
              type="submit"
              onClick={() => { }}
              label={editingCert ? "Update" : "Submit"}
              disabled={loading}
              className="text-white"
            />
            {onClose && (
              <Button
                type="button"
                label="Cancel"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={loading}
              />
            )}
          </div>

          <Loader
            loading={loading}
            message={loading ? `Saving certificates... (${elapsedTime}s)` : ""}
          />
        </form>

        {successMessage && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 text-center">
            {successMessage}
          </div>
        )}

        {/* --- AI Modals --- */}
        <AIInputModal
          isOpen={isAIModalOpen}
          onClose={() => setAIModalOpen(false)}
          onSubmit={handleGenerateCertificatesFromAI}
          loading={isAILoading}
          defaultText={aiTemplates[currentSection]} // <-- template for that section
          title={`Edit ${currentSection.replace("_", " ")}`}
          description="You can edit this text. AI will extract the info and fill the form."
          placeholder="I have completed AWS Certified Cloud Practitioner and React Developer courses."
          generateLabel="Generate Certificates"
          cancelLabel="Cancel"
        />

        <AIPreviewModal
          isOpen={isPreviewOpen}
          data={aiData}
          onClose={() => setPreviewOpen(false)}
          onAccept={handleAcceptCertificatesAI}
          title="Review Extracted Certificates"
          description="Confirm the AI-generated certificates before populating the form."
          acceptLabel="Accept & Autofill"
          discardLabel="Discard"
        />
      </section>
    </FormProvider>
  );
};

export default CertificateFormDetails;
