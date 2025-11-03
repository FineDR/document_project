/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { CVCard } from "../../utils/CVCard";
import { FaTrash, FaTimes } from "react-icons/fa";
import type { User, Certificate } from "../../types/cv/cv";
import CertificateFormDetails from "../forms/CertificateFormDetails";
import Loader from "../common/Loader";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchCertificates,
  addCertificate,
  updateCertificat,
  deleteCertificat,
} from "../../features/certificates/certificatesSlice";

interface Props {
  cv: User;
}

const CertificationsSection = ({ cv }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { certificates, loading } = useSelector((state: RootState) => state.certificates);

  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCertificat(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCert(null);
  };

  const handleDone = async (updatedCert: Certificate) => {
    try {
      if (updatedCert.id) {
        await dispatch(updateCertificat({ id: updatedCert.id, data: updatedCert })).unwrap();
      } else {
        await dispatch(addCertificate(updatedCert)).unwrap();
      }
    } catch (error) {
      console.error("Failed to save certificate:", error);
    } finally {
      handleCloseForm();
    }
  };

  return (
    <>
      <CVCard title="Certifications">
        {loading ? (
          <Loader loading={loading} message="Loading certificates..." />
        ) : certificates.length > 0 ? (
          <div className="space-y-4 font-sans text-subHeadingGray">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200"
              >
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

                <div className="flex items-start gap-4 mt-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-redMain text-redMain dark:text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                    {cert.name.charAt(0)}
                  </div>

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
          <p className="text-gray-400 italic font-sans text-start py-2">
            No certifications added yet
          </p>
        )}
      </CVCard>

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
              onUpdate={handleDone}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificationsSection;
