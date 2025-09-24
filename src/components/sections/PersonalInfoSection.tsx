/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CVCard } from "../../utils/CVCard";
import type { User } from "../../types/cv/cv";
import PersonDetailForm from "../forms/PersonalDetailsForm";

interface Props {
  cv: User;
}

const PersonalInfoSection = ({ cv }: Props) => {
  const info = cv.personal_details || null;
  const profile = cv.profiles || null;
  const [showModal, setShowModal] = useState(false);

  const formatLinkText = (url: string, platform: string) =>
    url ? `Visit ${platform}` : "-";

  const hasData =
    profile?.full_name ||
    profile?.email ||
    info?.phone ||
    info?.address ||
    info?.date_of_birth ||
    info?.nationality ||
    info?.linkedin ||
    info?.github ||
    info?.website;

  return (
    <>
      <CVCard title="Personal Information">
        {!hasData ? (
          <p className="text-gray-500 italic">No personal information added yet</p>
        ) : (
          <div className="text-gray-700 space-y-4">
            <div className="grid grid-cols-1 gap-4 mt-4">
              {/* Personal Details */}
              <div className="relative space-y-1 rounded-lg p-4 border hover:bg-blue-50 hover:shadow-xl transition-all duration-200">
                <button
                  className="absolute top-2 right-2 text-blue-600 hover:underline"
                  onClick={() => setShowModal(true)}
                >
                  Edit
                </button>
                <p><strong>Name:</strong> {profile?.full_name || "-"}</p>
                <p><strong>Email:</strong> {profile?.email || "-"}</p>
                <p><strong>Phone:</strong> {info?.phone || "-"}</p>
                <p><strong>Address:</strong> {info?.address || "-"}</p>
                <p><strong>Date of Birth:</strong> {info?.date_of_birth || "-"}</p>
                <p><strong>Nationality:</strong> {info?.nationality || "-"}</p>
              </div>

              {/* Links */}
              <div className="relative space-y-1 rounded-lg p-4 border hover:bg-purple-50 hover:shadow-xl transition-all duration-200">
                <button
                  className="absolute top-2 right-2 text-blue-600 hover:underline"
                  onClick={() => setShowModal(true)}
                >
                  Edit
                </button>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  {info?.linkedin ? (
                    <a
                      href={info.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formatLinkText(info.linkedin, "LinkedIn")}
                    </a>
                  ) : "-"}
                </p>
                <p>
                  <strong>GitHub:</strong>{" "}
                  {info?.github ? (
                    <a
                      href={info.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formatLinkText(info.github, "GitHub")}
                    </a>
                  ) : "-"}
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  {info?.website ? (
                    <a
                      href={info.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formatLinkText(info.website, "Website")}
                    </a>
                  ) : "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CVCard>

      {/* Modal for editing personal details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <PersonDetailForm
              existingDetails={info || {}}
              onDone={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoSection;
