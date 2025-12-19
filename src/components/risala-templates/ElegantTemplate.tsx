import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface ElegantTemplateProps {
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


const ElegantTemplate: React.FC<ElegantTemplateProps> = ({ isPreview }) => {
  const risalaData = useSelector((state: RootState) => state.risala.data);

  if (!risalaData) {
    return <div className="p-4 text-gray-500">No risala data available.</div>;
  }

  const { raw_data, generated_risala } = risalaData;

  return (
    <div
      className={`mx-auto bg-background text-text font-serif shadow-2xl rounded-3xl transition-colors duration-300
        ${isPreview ? "max-h-[90vh] overflow-y-auto" : ""}
      `}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "32mm",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* HEADER */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-wide">
          {raw_data.event_title || "RISALA YA TUKIO"}
        </h1>
        <p className="text-subheading text-sm uppercase tracking-widest">
          {(raw_data.event_type || "EVENT").toUpperCase()} • {raw_data.event_date || "Tarehe Haipo"} • {raw_data.event_location || "Mahali Hapajatajwa"}
        </p>
        <div className="mt-8 h-1 w-36 mx-auto bg-redMain rounded-full shadow-md"></div>
      </header>

      {/* GUEST & ORGANIZATION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14 text-sm">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-primary">
          <h2 className="text-subheading font-semibold mb-1">Mgeni Rasmi</h2>
          <p className="text-lg font-medium">{raw_data.guest_of_honor || "—"}</p>
          <p className="text-subheading text-xs mt-1">
            ({raw_data.guest_title || "Cheo hakijatajwa"})
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border-l-4 border-primary">
          <h2 className="text-subheading font-semibold mb-1">Shirika</h2>
          <p className="text-lg font-medium">{raw_data.organization_name || "—"}</p>
          {raw_data.organization_representative && (
            <p className="text-subheading text-xs mt-1">
              Mwakilishi: {raw_data.organization_representative}
            </p>
          )}
        </div>
      </section>

      {/* PURPOSE & BACKGROUND */}
      <section className="space-y-8 mb-14 text-sm leading-relaxed">
        {raw_data.purpose_statement && (
          <div className="p-6 bg-redMain/10 rounded-xl shadow-inner border-l-4 border-redMain">
            <h3 className="font-semibold text-subheading mb-2">Madhumuni ya Risala</h3>
            <p>{raw_data.purpose_statement}</p>
          </div>
        )}

        {raw_data.background_info && (
          <div className="p-6 bg-redMain/10 rounded-xl shadow-inner border-l-4 border-redMain">
            <h3 className="font-semibold text-subheading mb-2">Historia Fupi</h3>
            <p>{raw_data.background_info}</p>
          </div>
        )}
      </section>

      {/* MAIN RISALA */}
      {generated_risala && (
        <section className="prose prose-base max-w-none text-text mb-16">
          <h2 className="text-xl font-bold text-primary mb-4">Risala Kamili</h2>
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
      <footer className="mt-20 text-center text-subheading text-sm italic">
        — Mwisho wa Risala —
      </footer>
    </div>
  );
};

export default ElegantTemplate;
