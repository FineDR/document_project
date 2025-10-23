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
          <p className="text-gray-400 italic font-sans">No personal information added yet</p>
        ) : (
          <div className="space-y-6 font-sans text-subHeadingGray">
            <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Personal Details Frame */}
              <div className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-redBg transition-all duration-200">
                <button
                  className="absolute top-4 right-4 text-redMain font-medium hover:underline dark:text-redMain"
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

              {/* Links Frame */}
              <div className="relative rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-purple-50 transition-all duration-200">
                <button
                  className="absolute top-4 right-4 text-redMain font-medium hover:underline dark:text-redMain"
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
                      className="text-redMain hover:underline dark:text-redMain "
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
                      className="text-redMain hover:underline dark:text-redMain"
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
                      className="text-redMain hover:underline dark:text-redMain"
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
          <div className="bg-whiteBg rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <PersonDetailForm
              existingDetails={{...info,profile_image:undefined}}
              onDone={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfoSection;
