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
  const profile = cv.profile || null;
  const [showModal, setShowModal] = useState(false);

  const formatLinkText = (url: string, platform: string) =>
    url ? `Visit ${platform}` : "-";
  const full_name = `${info?.first_name || ""} ${info?.middle_name || ""} ${info?.last_name || ""}`.trim();
  const hasData =
    profile?.full_name ||
    profile?.email ||
    info?.first_name ||
    info?.middle_name ||
    info?.last_name ||
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
    <p className="text-gray-400 italic font-sans">No personal information added yet</p>
  ) : (
    <div className="space-y-6 font-sans text-subHeadingGray">
      <div className="grid grid-cols-1 gap-6 mt-4">
        {/* Personal Details & Links Combined */}
        <div className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200">
          <button
            className="absolute top-4 right-4 text-redMain font-medium hover:underline dark:text-redMain"
            onClick={() => setShowModal(true)}
          >
            Edit
          </button>

          {info?.first_name && <p><strong>Name:</strong> {full_name}</p>}
          {profile?.email && <p><strong>Email:</strong> {profile.email}</p>}
          {info?.phone && <p><strong>Phone:</strong> {info.phone}</p>}
          {info?.address && <p><strong>Address:</strong> {info.address}</p>}
          {info?.date_of_birth && <p><strong>Date of Birth:</strong> {info.date_of_birth}</p>}
          {info?.nationality && <p><strong>Nationality:</strong> {info.nationality}</p>}

          {info?.linkedin && (
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={info.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-redMain hover:underline dark:text-redMain"
              >
                {formatLinkText(info.linkedin, "LinkedIn")}
              </a>
            </p>
          )}

          {info?.github && (
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href={info.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-redMain hover:underline dark:text-redMain"
              >
                {formatLinkText(info.github, "GitHub")}
              </a>
            </p>
          )}

          {info?.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-redMain hover:underline dark:text-redMain"
              >
                {formatLinkText(info.website, "Website")}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )}
</CVCard>


      {/* Modal for editing personal details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto transition-all duration-300 border border-gray-200 dark:border-gray-700">

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-subheading hover:text-primary font-bold text-lg transition-colors duration-200"
              onClick={() => setShowModal(false)}
              aria-label="Close Modal"
            >
              ✕
            </button>

            {/* Form */}
            <PersonDetailForm
              existingDetails={{ ...info, profile_image: undefined }}
              onDone={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

    </>
  );
};

export default PersonalInfoSection;
