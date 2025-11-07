/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash } from "react-icons/fa";
import type { User, Certificate } from "../../types/cv/cv";
import CertificateFormDetails from "../forms/CertificateFormDetails";

interface Props {
  cv: User;
}

const CertificationsSection = ({ cv }: Props) => {
  // Pull certificates directly from cv data
  const certificates: Certificate[] = cv.profile?.certificates || [];

  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id?: number) => {
    if (!id) return;
    console.log("Delete certificate with id:", id);
  };

  const handleDone = (updatedCert?: Certificate) => {
    setEditingCert(null);
    setShowModal(false);
    console.log("Certificate saved/updated:", updatedCert);
  };

  return (
    <>
      <CVCard title="Certifications">
        {certificates.length === 0 ? (
          <p className="text-subheading italic font-sans text-sm">
            No certifications added yet
          </p>
        ) : (
          <div className="space-y-4 font-sans text-subheading">
            {certificates.map((cert, index) => (
              <div
                key={cert.id || index}
                className="relative rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-red-bg transition-all duration-200"
              >
                <div className="absolute top-3 right-3 flex gap-3 text-sm">
                  <span
                    className="text-primary font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setEditingCert(cert);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="text-gray-400 hover:text-primary cursor-pointer"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <FaTrash size={12} />
                  </span>
                </div>

                <p className="mt-4 text-sm text-subheading">
                  <span className="font-semibold">{cert.name}</span> - {cert.issuer}
                  {cert.date && (
                    <span className="ml-2 text-xs bg-blue-100 px-2 py-1 dark:text-gray-800 rounded">
                      {cert.date}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </CVCard>

      {/* Modal for editing certificate */}
      {showModal && editingCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 text-subheading hover:text-text cursor-pointer font-bold text-lg"
              onClick={() => setShowModal(false)}
            >
              ✕
            </span>

            <CertificateFormDetails
              editingCert={editingCert}
              onUpdate={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificationsSection;
