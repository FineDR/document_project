import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface TraditionalTemplateProps {
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

const TraditionalTemplate: React.FC<TraditionalTemplateProps> = ({ isPreview }) => {
  const risalaData = useSelector((state: RootState) => state.risala.data);

  if (!risalaData) {
    return <div className="p-4 text-gray-500">No risala data available.</div>;
  }

  const { raw_data, generated_risala } = risalaData;

  return (
    <div
      className={`mx-auto bg-background text-text font-serif shadow-xl transition-colors duration-300
      ${isPreview ? "max-h-[90vh] overflow-y-auto" : ""}
    `}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "28mm",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >

      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-wide text-primary mb-3">
          {raw_data.event_title || "RISALA YA TUKIO"}
        </h1>

        <p className="text-sm text-subheading">
          {(raw_data.event_type || "EVENT").toUpperCase()} •{" "}
          {raw_data.event_date || "Tarehe Haipo"} •{" "}
          {raw_data.event_location || "Mahali Hapajatajwa"}
        </p>

        <div className="mt-4 h-[1px] w-32 mx-auto bg-redMain/60"></div>
      </header>

      {/* GUEST INFO */}
      <section className="text-sm leading-relaxed mb-8">
        <h2 className="text-lg font-semibold text-subheading mb-2">Taarifa za Wageni</h2>

        <p>
          <span className="font-semibold">Mgeni Rasmi:</span>{" "}
          {raw_data.guest_of_honor || "—"}{" "}
          <span className="text-subheading">
            ({raw_data.guest_title || "Cheo hakijatajwa"})
          </span>
        </p>

        <p className="mt-1">
          <span className="font-semibold">Shirika:</span>{" "}
          {raw_data.organization_name || "—"}{" "}
          {raw_data.organization_representative && (
            <> — Mwakilishi: {raw_data.organization_representative}</>
          )}
        </p>
      </section>

      {/* PURPOSE & BACKGROUND */}
      <section className="text-sm mb-10">
        {raw_data.purpose_statement && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-subheading mb-2">Madhumuni ya Risala</h2>
            <p className="leading-relaxed">{raw_data.purpose_statement}</p>
          </div>
        )}

        {raw_data.background_info && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-subheading mb-2">Historia Fupi</h2>
            <p className="leading-relaxed">{raw_data.background_info}</p>
          </div>
        )}
      </section>

      {/* MAIN RISALA BODY */}
      {generated_risala && (
        <section className="prose prose-sm max-w-none text-text">
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
      <footer className="mt-16 text-center text-sm text-subheading">
        — Mwisho wa Risala —
      </footer>
    </div>
  );
};

export default TraditionalTemplate;
