/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
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
import type { Certificate } from "../../types/cv/cv";

type FormFields = z.infer<typeof certificationsSchema>;

interface Props {
  editingCert?: Certificate | null;
  onClose?: () => void;
  onUpdate?: (updatedCert: Certificate) => void;
}

const CertificateFormDetails: React.FC<Props> = ({ editingCert, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: { certificates: [{ name: "", issuer: "", date: "" }] },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "certificates" });

  const { withLoader } = useTimedLoader(3000);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  // Prefill form if editing
  useEffect(() => {
    if (editingCert) {
      replace([{ ...editingCert }]);
    } else {
      reset({ certificates: [{ name: "", issuer: "", date: "" }] });
    }
  }, [editingCert, replace, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    const payload = {
      full_name: [user.first_name, user.last_name].filter(Boolean).join(" "),
      email: user.email,
      certificates: data.certificates.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        profile: user.profile?.id,
      })),
    };

    await withLoader(async () => {
      setLoading(true);
      const startTime = Date.now();
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        let resultAction;
        let message = "";

        if (editingCert?.id) {
          resultAction = await dispatch(updateCertificat({ id: editingCert.id, data: payload }));
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

  return (
    <section className="w-full mx-auto p-6 bg-whiteBg border rounded-md shadow-md">
      <h2 className="text-h2 font-semibold text-center mb-4">
        {editingCert ? "Edit Certificate" : "Add Certificate"}
      </h2>

      <p className="text-subHeadingGray text-sm mb-6 text-center">
        Fill in your certificate details. Required fields are marked with *.
      </p>

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
            <p className="text-gray-500 text-xs">
              Enter the full name of the certificate or course completed.
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
            <p className="text-gray-500 text-xs">
              Name of the organization or platform that issued this certificate.
            </p>

            <InputField
              type="date"
              label="Issued Date *"
              name={`certificates.${index}.date`}
              register={register(`certificates.${index}.date`)}
              error={errors.certificates?.[index]?.date?.message}
              disabled={loading}
            />
            <p className="text-gray-500 text-xs">
              The date the certificate was awarded.
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
            className="bg-redMain text-white hover:bg-redMain/80"
          />
          <Button
            type="submit"
            onClick={() => { }}
            label={editingCert ? "Update" : "Save"}
            disabled={loading}
            className="bg-redMain text-white hover:bg-redMain/80"
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
    </section>
  );
};

export default CertificateFormDetails;
