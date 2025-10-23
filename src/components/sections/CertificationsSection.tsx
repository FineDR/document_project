/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash, FaTimes } from "react-icons/fa";
import type { User, Certificate } from "../../types/cv/cv";
import CertificateFormDetails from "../forms/CertificateFormDetails";
import { deleteCertificate } from "../../api/submitCertificates";

interface Props {
  cv: User;
}

const CertificationsSection = ({ cv }: Props) => {
  const certificates = cv.profile?.certificates || [];

  const [certData, setCertData] = useState<Certificate[]>(certificates);
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteCertificate(id);
      setCertData((prev) => prev.filter((cert) => cert.id !== id));
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCert(null);
  };

  return (
    <>
      <CVCard title="Certifications">
        {certData.length > 0 ? (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {certData.map((cert) => (
              <div
                key={cert.id}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
                {/* Top Row: Actions */}
                <div className="absolute top-4 right-4 flex gap-3 text-sm">
                  <button
                    className="text-redMain font-medium hover:underline"
                    onClick={() => handleEdit(cert)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-400 hover:text-redMain"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Bottom Row: Avatar + Certificate info */}
                <div className="flex items-start gap-4 mt-2">
                  {/* Circle Avatar */}
                  <div className="w-10 h-10 bg-blue-100 dark:bg-redMain text-redMain dark:text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                    {cert.name.charAt(0)}
                  </div>

                  {/* Certificate details */}
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white">{cert.name}</h4>
                    <p className="text-gray-600 text-sm dark:text-white italic">{cert.issuer}</p>
                    {cert.date && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full w-fit">
                        {cert.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic font-sans text-center py-2">
            No certifications added yet
          </p>
        )}
      </CVCard>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              onClick={handleCloseForm}
            >
              <FaTimes />
            </button>

            <CertificateFormDetails
              editingCert={editingCert}
              onClose={handleCloseForm}
              onUpdate={(updatedCert: Certificate) => {
                setCertData((prev) =>
                  editingCert
                    ? prev.map((cert) =>
                        cert.id === updatedCert.id ? updatedCert : cert
                      )
                    : [...prev, updatedCert]
                );
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificationsSection;
