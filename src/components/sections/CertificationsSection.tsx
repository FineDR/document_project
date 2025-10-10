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
  // Get certificates safely from cv.profile.certificates
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
          <div className="space-y-4">
            {certData.map((cert) => (
              <div
                key={cert.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                {/* Top Row: Actions aligned right */}
                <div className="flex justify-end items-center gap-4 mb-2 text-sm">
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleEdit(cert)}
                  >
                    Edit
                  </span>
                  <FaTrash
                    className="cursor-pointer text-gray-400 hover:text-red-600"
                    onClick={() => handleDelete(cert.id)}
                  />
                </div>
                <hr className="mt-4"/>
                {/* Bottom Row: Avatar + Certificate info */}
                <div className="flex items-start gap-3 mt-4">
                  {/* Circle Avatar with first letter */}
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                    {cert.name.charAt(0)}
                  </div>

                  {/* Certificate details stacked */}
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
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
          <div className="text-center py-2">
            <p className="text-gray-500 italic">No certifications added yet</p>
          </div>
        )}
      </CVCard>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
            <span
              className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleCloseForm}
            >
              <FaTimes size={15} />
            </span>
            <CertificateFormDetails
              editingCert={editingCert}
              onClose={handleCloseForm}
              onUpdate={(updatedCert) => {
                setCertData((prev) => {
                  if (editingCert) {
                    return prev.map((cert) =>
                      cert.id === updatedCert.id ? updatedCert : cert
                    );
                  } else {
                    return [...prev, updatedCert];
                  }
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificationsSection;
