import React, { useEffect, useState } from "react";

interface PreviewPageProps {
  content?: { label: string; value: string }[];
  logoFile?: File | null;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ content = [], logoFile }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(logoFile);
    } else {
      setLogoUrl(null);
    }
  }, [logoFile]);

  return (
    <div className="m-5 p-10 flex flex-col gap-4 justify-center items-center bg-background text-text rounded shadow aspect-[210/297]">
      {logoUrl && <img src={logoUrl} alt="University Logo" className="w-32 mb-4" />}
      <div className="text-center flex flex-col gap-1">
        {content.map((item, idx) => (
          <div key={idx} className={item.label === "STUDENT NAME" ? "text-xl font-bold" : "text-lg"}>
            <span className="font-semibold">{item.label}: </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto text-sm text-subheading">Generated using Mini-Report System</div>
    </div>
  );
};

export default PreviewPage;
