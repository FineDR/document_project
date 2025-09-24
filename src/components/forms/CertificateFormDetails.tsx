/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationsSchema } from "../forms/cvValidationSchema";
import type { z } from "zod";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import InputField from "../formElements/InputField";
import Button from "../formElements/Button";
import {
  submitCertificates,
  updateCertificate,
} from "../../api/submitCertificates";
import type { Certificate } from "../../types/cv/cv";
import { useTimedLoader } from "../../hooks/useTimedLoader";
import Loader from "../common/Loader";

// Form fields come from Zod schema
type FormFields = z.infer<typeof certificationsSchema>;

interface CertificateFormDetailsProps {
  editingCert?: Certificate | null;
  onClose: () => void;
  onUpdate: (cert: Certificate) => void;
}

const CertificateFormDetails: React.FC<CertificateFormDetailsProps> = ({
  editingCert,
  onClose,
  onUpdate,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certificates: [{ name: "", issuer: "", date: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "certificates",
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, withLoader } = useTimedLoader(3000); // Minimum loader duration 3s
  const [elapsedTime, setElapsedTime] = useState(0);
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-blue-600/60";

  const handleOnClick = () => setActive(!active);

  useEffect(() => {
    if (editingCert) {
      replace([
        {
          name: editingCert.name,
          issuer: editingCert.issuer,
          date: editingCert.date,
        },
      ]);
    }
  }, [editingCert, replace]);

  if (!user) return <p>Not logged in</p>;

  const full_name =
    user.profiles?.full_name ||
    [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!user) return;

    await withLoader(async () => {
      const startTime = Date.now();
      setElapsedTime(0);

      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);

      try {
        let updatedCert: Certificate;

        if (editingCert) {
          const payload = {
            name: data.certificates[0].name,
            issuer: data.certificates[0].issuer,
            date: data.certificates[0].date,
          };

          updatedCert = await updateCertificate(editingCert.id, payload);
        } else {
          const payload = {
            certificates: [
              {
                name: data.certificates[0].name,
                issuer: data.certificates[0].issuer,
                date: data.certificates[0].date,
              },
            ],
            full_name,
            email: user.email,
          };

          updatedCert = await submitCertificates(payload);
        }

        onUpdate(updatedCert);
        reset();
        onClose();
      } catch (error) {
        console.error("❌ Error submitting certificate:", error);
      } finally {
        clearInterval(interval);
      }
    });
  };

  return (
    <section className="relative mx-auto p-6 bg-white border rounded-lg m-8">
      <h2 className="text-center text-primary text-2xl font-semibold mb-6">
        {editingCert ? "Edit Certificate" : "Add Certificate"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 space-y-4 relative">
            <InputField
              type="text"
              label="Certificate Name *"
              placeholder="e.g., AWS Certified Cloud Practitioner, Microsoft Azure Fundamentals"
              name={`certificates.${index}.name`}
              register={register(`certificates.${index}.name`)}
              error={errors.certificates?.[index]?.name?.message}
              disabled={loading}
            />

            <InputField
              type="text"
              label="Issuer *"
              placeholder="e.g., Amazon Web Services, Microsoft, Coursera"
              name={`certificates.${index}.issuer`}
              register={register(`certificates.${index}.issuer`)}
              error={errors.certificates?.[index]?.issuer?.message}
              disabled={loading}
            />

            <InputField
              type="date"
              label="Issued Date *"
              name={`certificates.${index}.date`}
              register={register(`certificates.${index}.date`)}
              error={errors.certificates?.[index]?.date?.message}
              disabled={loading}
            />

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={loading}
                className="text-red-500 underline text-sm"
              >
                Remove Certificate
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-3 justify-start px-4">
          <Button
            type="button"
            label="+ Add Certificate"
            onClick={() => append({ name: "", issuer: "", date: "" })}
            disabled={loading}
            className="bg-red-500 text-white hover:bg-red-600"
          />
          <Button
            type="submit"
            label={editingCert ? "Update" : "Submit"}
            disabled={loading}
            onClick={handleOnClick}
            className={`${active ? hoverStyle : ""}`}
          />
        </div>

        {/* Reusable loader with elapsed time */}
        <Loader
          loading={loading}
          message={
            loading
              ? `Saving your certificates... (${elapsedTime}s elapsed)`
              : ""
          }
        />
      </form>
    </section>
  );
};

export default CertificateFormDetails;
