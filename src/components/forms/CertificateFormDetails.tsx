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

type FormFields = z.infer<typeof certificationsSchema>;

interface CertificateFormDetailsProps {
  editingCert?: any | null;
  onClose?: () => void;
}

const CertificateFormDetails: React.FC<CertificateFormDetailsProps> = ({ editingCert }) => {
  const dispatch = useDispatch();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormFields>({
    defaultValues: { certificates: [{ name: "", issuer: "", date: "" }] },
    resolver: zodResolver(certificationsSchema),
  });

  const user = useSelector((state: RootState) => state.auth.user);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "certificates",
  });

  const { withLoader } = useTimedLoader(3000);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [active, setActive] = useState(false);
  const hoverStyle = "hover:bg-blue-600/60";

  const handleOnClick = () => setActive(!active);

  // Prefill form if editing
  useEffect(() => {
    if (editingCert) {
      replace([{ ...editingCert }]);
    } else {
      reset({ certificates: [{ name: "", issuer: "", date: "" }] });
    }
  }, [editingCert, replace, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const payload = {
      full_name: user?.first_name + " " + user?.last_name,
      email: user?.email,
      certificates: data.certificates.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        profile: user?.profile?.id,
      }))
    };

    console.log("Submitted Data:", payload);

    await withLoader(async () => {
      setLoading(true);
      const startTime = Date.now();
      const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 100);

      try {
        let resultAction;
        let message = "";

        if (editingCert) {
          resultAction = await dispatch(updateCertificat({ id: editingCert.id, data: payload }));
          message = "✅ Certificate updated successfully!";
        } else {
          resultAction = await dispatch(addCertificate(payload));
          message = "✅ Certificate added successfully!";
        }

        if (resultAction.meta.requestStatus === "fulfilled") {
          setSuccessMessage(message);
          reset({ certificates: [{ name: "", issuer: "", date: "" }] });
        } else {
          console.error("Failed to save certificate:", resultAction.payload);
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
    <section className="mx-auto p-6 bg-white border rounded-lg m-8">
      <h2 className="text-center text-primary text-2xl font-semibold mb-6">
        {editingCert ? "Edit Certificate" : "Add Certificate"}
      </h2>
      {/* Guidance message */}
      <p className="text-gray-600 text-sm mb-4 text-center">
        Fill in your certificate details. Required fields are marked with *.
      </p>

      

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 space-y-4 relative ">
            <InputField
              type="text"
              label="Certificate Name *"
              placeholder="e.g., AWS Certified Cloud Practitioner"
              name={`certificates.${index}.name`}
              register={register(`certificates.${index}.name`)}
              error={errors.certificates?.[index]?.name?.message}
              disabled={loading}
            />
            <p className="text-gray-500 text-xs">
              Enter the full name of the certificate or course you completed.
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
              The organization or company that issued the certificate.
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
              The date you were awarded the certificate.
            </p>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={loading}
                className="text-red-500 underline text-sm"
              >
                Remove
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

        <Loader
          loading={loading}
          message={loading ? `Saving... (${elapsedTime}s)` : ""}
        />
      </form>

      {successMessage && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
          {successMessage}
        </div>
      )}
    </section>
  );
};

export default CertificateFormDetails;
