import React, { useMemo } from "react";
import ReportForm from "../components/reports/ReportForm";
import PreviewPage from "../components/reports/PreviewPage";

const PDFReports: React.FC = () => {
  // Example dynamic content
  const reportContent = Array.from({ length: 23 }, (_, i) => `Report Item ${i + 1}`);
  const previewContent = Array.from({ length: 17 }, (_, i) => `Preview Item ${i + 1}`);

  const itemsPerPage = 5; // how many items fit per page

  // Split report content into pages
  const reportPages = useMemo(() => {
    const pages: string[][] = [];
    for (let i = 0; i < reportContent.length; i += itemsPerPage) {
      pages.push(reportContent.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [reportContent]);

  // Split preview content into pages
  const previewPages = useMemo(() => {
    const pages: string[][] = [];
    for (let i = 0; i < previewContent.length; i += itemsPerPage) {
      pages.push(previewContent.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [previewContent]);

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center mt-10 overflow-x-auto bg-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-[1200px] justify-center">

        {/* Left Column */}
        <div className="flex flex-col gap-6 w-full lg:flex-1 lg:max-w-[48%]">
          {reportPages.map((pageContent, idx) => (
            <div
              key={idx}
              className="bg-whiteBg w-full aspect-[210/297] shadow-lg rounded-lg border border-gray-300 flex-shrink-0 overflow-hidden"
            >
              <ReportForm content={pageContent} />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 w-full lg:flex-1 lg:max-w-[48%]">
          {previewPages.map((pageContent, idx) => (
            <div
              key={idx}
              className="bg-whiteBg w-full aspect-[210/297] shadow-lg rounded-lg border border-gray-300 flex-shrink-0 overflow-hidden"
            >
              <PreviewPage content={pageContent} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PDFReports;
