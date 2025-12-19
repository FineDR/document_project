import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface MinimalTemplateProps {
  isPreview?: boolean;
}

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index}>
          {part.replace(/\*\*/g, "")}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
};


const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ isPreview }) => {
  const risalaData = useSelector((state: RootState) => state.risala.data);

  if (!risalaData) {
    return (
      <div className="p-4 text-subheading">
        Hakuna data ya risala iliyopatikana.
      </div>
    );
  }

  const { raw_data, generated_risala } = risalaData;

  return (
    <div
      className={`mx-auto bg-background text-text font-sans transition-colors duration-300
        ${isPreview ? "max-h-[90vh] overflow-y-auto" : ""}
      `}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "24mm",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-h1 font-extrabold text-primary mb-1 tracking-tight">
          {raw_data.event_title || "RISALA YA TUKIO"}
        </h1>
        <p className="text-subheading text-sm uppercase tracking-wider">
          {(raw_data.event_type || "EVENT").toUpperCase()} •{" "}
          {raw_data.event_date || "Tarehe Haipo"} •{" "}
          {raw_data.event_location || "Mahali Hapajatajwa"}
        </p>
        <div className="mt-4 h-1 w-20 bg-subheading-gray mx-auto rounded-full"></div>
      </header>

      {/* GUEST & ORGANIZATION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-sm">
        <div className="p-4 rounded-lg border border-subheading-gray bg-background/5">
          <h2 className="font-semibold mb-1">Mgeni Rasmi</h2>
          <p className="font-medium">{raw_data.guest_of_honor || "—"}</p>
          <p className="text-subheading text-xs mt-1">
            ({raw_data.guest_title || "Cheo hakijatajwa"})
          </p>
        </div>

        <div className="p-4 rounded-lg border border-subheading-gray bg-background/5">
          <h2 className="font-semibold mb-1">Shirika</h2>
          <p className="font-medium">{raw_data.organization_name || "—"}</p>
          {raw_data.organization_representative && (
            <p className="text-subheading text-xs mt-1">
              Mwakilishi: {raw_data.organization_representative}
            </p>
          )}
        </div>
      </section>

      {/* PURPOSE & BACKGROUND */}
      <section className="space-y-6 mb-10 text-sm leading-relaxed">
        {raw_data.purpose_statement && (
          <div className="p-4 border-l-4 border-subheading-gray bg-background/5 rounded">
            <h3 className="font-semibold mb-1">Madhumuni ya Risala</h3>
            <p>{raw_data.purpose_statement}</p>
          </div>
        )}

        {raw_data.background_info && (
          <div className="p-4 border-l-4 border-subheading-gray bg-background/5 rounded">
            <h3 className="font-semibold mb-1">Historia Fupi</h3>
            <p>{raw_data.background_info}</p>
          </div>
        )}
      </section>

      {/* MAIN RISALA */}
      {generated_risala && (
        <section className="prose max-w-none text-text mb-12">
          <h2 className="text-xl font-bold mb-3">Risala Kamili</h2>
          <div className="leading-relaxed space-y-2">
            {generated_risala.split("\n").map((line, i) => {
              const isTitle = /^\*\*[^*]+\*\*$/.test(line.trim());

              if (isTitle) {
                return (
                  <h3
                    key={i}
                    className="text-base font-bold mt-4 mb-1 text-text"
                  >
                    {line.replace(/\*\*/g, "")}
                  </h3>
                );
              }

              return (
                <p key={i}>
                  {renderBoldText(line)}
                </p>
              );
            })}
          </div>

        </section>
      )}

      {/* FOOTER */}
      <footer className="mt-16 text-center text-subheading text-sm italic">
        — Mwisho wa Risala —
      </footer>
    </div>
  );
};

export default MinimalTemplate;
