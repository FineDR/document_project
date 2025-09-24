// src/pages/TemplateBrowser.tsx
import { useState, useEffect, useRef } from "react";
import Button from "../components/formElements/Button";
import type { User } from "../types/cv/cv";
import { ClipLoader } from "react-spinners";
import { useCurrentUserCV } from "../hooks/useCurrentUserCV";
import { useAppSelector } from "../hooks/reduxHooks";
import { SignIn } from "../components/navigation/TopNav";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

// Modal component
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 p-6 relative shadow-lg max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold bg-white rounded-full p-2 shadow-md z-10"
        >
          &times;
        </button>
        <div className="overflow-y-auto max-h-[80vh] pr-2">{children}</div>
      </div>
    </div>
  );
};

// Types
type Template = {
  id: string;
  name: string;
  description: string;
  component: React.FC<{ data: User }>;
  previewColor: string;
  previewIcon: string;
};
type Category = { id: string; name: string; templates: Template[] };

// Minimalist Template Component
const MinimalistTemplate = ({ data }: { data: User }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.profiles?.full_name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.profiles?.email && <span>{data.profiles.email}</span>}
          {data.personal_details?.phone && <span>{data.personal_details.phone}</span>}
          {data.personal_details?.address && <span>{data.personal_details.address}</span>}
        </div>
      </div>
      {/* Sections */}
      {data.personal_details?.profile_summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">{data.personal_details.profile_summary}</p>
        </div>
      )}
      {data.work_experiences && data.work_experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase mb-2 border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          {data.work_experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.job_title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 italic">{exp.company}, {exp.location}</p>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc pl-5 mt-2">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp.value}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {data.educations && data.educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase mb-2 border-b border-gray-300 pb-1">
            Education
          </h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-bold">{edu.degree}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(edu.start_date).toLocaleDateString()} - {new Date(edu.end_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600">{edu.institution}, {edu.location}</p>
              {edu.grade && <p className="text-gray-600">Grade: {edu.grade}</p>}
            </div>
          ))}
        </div>
      )}
      {data.skill_sets && data.skill_sets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase mb-2 border-b border-gray-300 pb-1">
            Skills
          </h2>
          {data.skill_sets[0].technical_skills && data.skill_sets[0].technical_skills.length > 0 && (
            <div className="mb-2">
              <h3 className="font-semibold">Technical Skills:</h3>
              <p>{data.skill_sets[0].technical_skills.map(skill => skill.value).join(", ")}</p>
            </div>
          )}
          {data.skill_sets[0].soft_skills && data.skill_sets[0].soft_skills.length > 0 && (
            <div>
              <h3 className="font-semibold">Soft Skills:</h3>
              <p>{data.skill_sets[0].soft_skills.map(skill => skill.value).join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Modern Template Component
const ModernTemplate = ({ data }: { data: User }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white flex font-sans text-gray-800">
      {/* Sidebar */}
      <div className="w-1/3 bg-teal-700 text-white p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {data.profiles?.full_name || "Your Name"}
          </h1>
          {data.career_objectives && data.career_objectives.length > 0 && data.career_objectives[0].career_objective && (
            <p className="text-teal-200 text-sm">{data.career_objectives[0].career_objective}</p>
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 pb-1 border-b border-teal-500">Contact</h2>
          {data.profiles?.email && <p className="mb-2 flex items-center"><span className="mr-2">📧</span> {data.profiles.email}</p>}
          {data.personal_details?.phone && <p className="mb-2 flex items-center"><span className="mr-2">📱</span> {data.personal_details.phone}</p>}
          {data.personal_details?.address && <p className="mb-2 flex items-center"><span className="mr-2">🏠</span> {data.personal_details.address}</p>}
          {data.personal_details?.linkedin && <p className="mb-2 flex items-center"><span className="mr-2">🔗</span> LinkedIn</p>}
        </div>
        {data.skill_sets && data.skill_sets.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b border-teal-500">Skills</h2>
            {data.skill_sets[0].technical_skills && data.skill_sets[0].technical_skills.length > 0 && (
              <div className="mb-3">
                <h3 className="font-semibold text-teal-200">Technical</h3>
                <p className="text-sm">{data.skill_sets[0].technical_skills.map(skill => skill.value).join(", ")}</p>
              </div>
            )}
            {data.skill_sets[0].soft_skills && data.skill_sets[0].soft_skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-teal-200">Soft</h3>
                <p className="text-sm">{data.skill_sets[0].soft_skills.map(skill => skill.value).join(", ")}</p>
              </div>
            )}
          </div>
        )}
        {data.languages && data.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b border-teal-500">Languages</h2>
            {data.languages.map((lang, index) => (
              <p key={index} className="mb-1">{lang.language} - {lang.proficiency}</p>
            ))}
          </div>
        )}
      </div>
      {/* Main Content */}
      <div className="w-2/3 p-6">
        {data.personal_details?.profile_summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-teal-700 mb-3 pb-1 border-b-2 border-teal-700">
              Professional Summary
            </h2>
            <p className="text-gray-700">{data.personal_details.profile_summary}</p>
          </div>
        )}
        {data.work_experiences && data.work_experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-teal-700 mb-3 pb-1 border-b-2 border-teal-700">
              Work Experience
            </h2>
            {data.work_experiences.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-lg">{exp.job_title}</h3>
                <p className="text-gray-600 italic">{exp.company}, {exp.location}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}
                </p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-5">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="mb-1">{resp.value}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {data.educations && data.educations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-teal-700 mb-3 pb-1 border-b-2 border-teal-700">
              Education
            </h2>
            {data.educations.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}, {edu.location}</p>
                <p className="text-sm text-gray-500">
                  {new Date(edu.start_date).toLocaleDateString()} - {new Date(edu.end_date).toLocaleDateString()}
                </p>
                {edu.grade && <p className="text-gray-600">Grade: {edu.grade}</p>}
              </div>
            ))}
          </div>
        )}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-teal-700 mb-3 pb-1 border-b-2 border-teal-700">
              Projects
            </h2>
            {data.projects.map((proj, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold">{proj.title}</h3>
                {proj.description && <p className="text-gray-700 mb-1">{proj.description}</p>}
                {proj.link && <p className="text-blue-600 text-sm">Link: {proj.link}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Technologies: {proj.technologies.map(tech => tech.value).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Classic Template Component
const ClassicTemplate = ({ data }: { data: User }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-serif text-gray-800">
      {/* Header with blue underline */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-3">
          {data.profiles?.full_name || "Your Name"}
        </h1>
        <div className="h-1 w-32 bg-blue-800 mx-auto mb-4"></div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {data.profiles?.email && <span>{data.profiles.email}</span>}
          {data.personal_details?.phone && <span>{data.personal_details.phone}</span>}
          {data.personal_details?.address && <span>{data.personal_details.address}</span>}
        </div>
      </div>
      {/* Sections */}
      {data.career_objectives && data.career_objectives.length > 0 && data.career_objectives[0].career_objective && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Career Objective</h2>
          <p className="text-gray-700">{data.career_objectives[0].career_objective}</p>
        </div>
      )}
      {data.personal_details?.profile_summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{data.personal_details.profile_summary}</p>
        </div>
      )}
      {data.work_experiences && data.work_experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Work Experience</h2>
          {data.work_experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-lg">{exp.job_title} | {exp.company}, {exp.location}</h3>
              <p className="text-gray-600 italic mb-2">
                {new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}
              </p>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc pl-5">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-1">{resp.value}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {data.educations && data.educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Education</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold">{edu.degree} | {edu.institution}, {edu.location}</h3>
              <p className="text-gray-600 italic">
                {new Date(edu.start_date).toLocaleDateString()} - {new Date(edu.end_date).toLocaleDateString()} | Grade: {edu.grade}
              </p>
            </div>
          ))}
        </div>
      )}
      {data.skill_sets && data.skill_sets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Skills</h2>
          {data.skill_sets[0].technical_skills && data.skill_sets[0].technical_skills.length > 0 && (
            <p className="mb-1"><span className="font-semibold">Technical Skills:</span> {data.skill_sets[0].technical_skills.map(skill => skill.value).join(", ")}</p>
          )}
          {data.skill_sets[0].soft_skills && data.skill_sets[0].soft_skills.length > 0 && (
            <p><span className="font-semibold">Soft Skills:</span> {data.skill_sets[0].soft_skills.map(skill => skill.value).join(", ")}</p>
          )}
        </div>
      )}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Projects</h2>
          {data.projects.map((proj, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold">{proj.title}</h3>
              {proj.description && <p className="text-gray-700 mb-1">{proj.description}</p>}
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-sm text-gray-600">
                  Technologies: {proj.technologies.map(tech => tech.value).join(", ")}
                </p>
              )}
              {proj.link && <p className="text-blue-600 text-sm">Project Link: {proj.link}</p>}
            </div>
          ))}
        </div>
      )}
      {data.languages && data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Languages</h2>
          {data.languages.map((lang, index) => (
            <p key={index} className="mb-1">Language: {lang.language} - Proficiency: {lang.proficiency}</p>
          ))}
        </div>
      )}
      {data.profiles?.certificates && data.profiles.certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Certifications</h2>
          {data.profiles.certificates.map((cert, index) => (
            <p key={index} className="mb-1">* {cert.name} - {cert.issuer} ({new Date(cert.date).toLocaleDateString()})</p>
          ))}
        </div>
      )}
      {data.references && data.references.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-800 mb-2">References</h2>
          {data.references.map((ref, index) => (
            <p key={index} className="mb-1">{ref.name} | {ref.position} | {ref.email} | {ref.phone}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Categories
const categories: Category[] = [
  {
    id: "cv",
    name: "CVs",
    templates: [
      {
        id: "minimalist-cv",
        name: "Minimalist CV",
        description: "Clean, simple layout with ample whitespace.",
        component: MinimalistTemplate,
        previewColor: "from-gray-100 to-gray-200",
        previewIcon: "📄",
      },
      {
        id: "modern-cv",
        name: "Modern CV",
        description: "Professional, modern layout with two-column design.",
        component: ModernTemplate,
        previewColor: "from-teal-100 to-cyan-200",
        previewIcon: "💼",
      },
      {
        id: "finance-cv",
        name: "Finance CV (Tanzania)",
        description: "Tailored for finance professionals with classic styling.",
        component: ClassicTemplate,
        previewColor: "from-blue-100 to-indigo-200",
        previewIcon: "📊",
      },
    ],
  },
];

const documentTypes = ["PDF", "Word Document", "Google Docs"];

// Helper function to format dates
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

// Classic CV Generator
async function generateClassicDoc(user: User, type: string) {
  if (type !== "PDF") {
    alert("Currently only PDF export is supported for Classic CV.");
    return;
  }
  
  const pdfDoc = await PDFDocument.create();
  const pageSize: [number, number] = [595, 842]; // A4
  let page = pdfDoc.addPage(pageSize);
  
  // Standard margins with professional spacing
  const margin = 60;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  let y = pageHeight - margin;
  let pageNumber = 1;
  
  // Use Times New Roman font for a classic, professional look
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  
  // Professional formatting with improved readability
  const fontSize = 12;
  const nameSize = 22;
  const headingSize = 16;
  const lineHeight = fontSize * 1.8; // Increased line height for classic feel
  const sectionSpacing = lineHeight * 0.4; // Further reduced spacing between sections
  
  // Enhanced color scheme with decorative elements
  const primaryColor = rgb(0.1, 0.2, 0.5); // Deep navy blue for headings
  const textColor = rgb(0.2, 0.2, 0.2); // Dark charcoal for text
  const accentColor = rgb(0.3, 0.5, 0.8); // Medium blue for accents
  const highlightColor = rgb(0.6, 0.7, 0.9); // Light blue for highlights
  
  // Add subtle colored background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.99, 0.99, 0.99), // Very light off-white
  });
  
  // Add decorative border with accent color
  page.drawRectangle({
    x: margin - 10,
    y: margin - 10,
    width: pageWidth - (margin - 10) * 2,
    height: pageHeight - (margin - 10) * 2,
    borderWidth: 1.2,
    borderColor: accentColor,
  });
  
  // Add page footer with page number
  const drawFooter = () => {
    const footerText = `Page ${pageNumber}`;
    const textWidth = timesRoman.widthOfTextAtSize(footerText, 10);
    page.drawText(footerText, {
      x: pageWidth - textWidth - margin,
      y: margin / 2,
      size: 10,
      font: timesRomanItalic,
      color: accentColor,
    });
  };
  
  drawFooter();
  
  // Helper function to check if we need a new page
  const checkPageSpace = (requiredSpace: number) => {
    if (y - requiredSpace < margin + 30) { // Added space for footer
      page = pdfDoc.addPage(pageSize);
      pageNumber++;
      
      // Add subtle colored background for new page
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0.99, 0.99, 0.99),
      });
      
      // Add decorative border for new page
      page.drawRectangle({
        x: margin - 10,
        y: margin - 10,
        width: pageWidth - (margin - 10) * 2,
        height: pageHeight - (margin - 10) * 2,
        borderWidth: 1.2,
        borderColor: accentColor,
      });
      
      drawFooter();
      
      y = page.getHeight() - margin;
      return true;
    }
    return false;
  };
  
  // Improved text helper with better word wrapping and paragraph margins
  const drawParagraph = (text: string, maxWidth: number = pageWidth - margin * 2, font = timesRoman, size = fontSize, xPos = margin, color = textColor, indent = false) => {
    if (!text) return;
    
    // Add first-line indent for classic paragraph look
    const indentSize = indent ? 20 : 0;
    
    const words = text.split(" ");
    let line = "";
    let isFirstLine = true;
    
    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      const lineWidth = font.widthOfTextAtSize(testLine, size);
      
      if (lineWidth > maxWidth - (isFirstLine ? indentSize : 0)) {
        checkPageSpace(lineHeight);
        y -= lineHeight;
        page.drawText(line, { 
          x: xPos + (isFirstLine ? indentSize : 0), 
          y, 
          font, 
          size, 
          color 
        });
        line = word;
        isFirstLine = false;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      checkPageSpace(lineHeight);
      y -= lineHeight;
      page.drawText(line, { 
        x: xPos + (isFirstLine ? indentSize : 0), 
        y, 
        font, 
        size, 
        color 
      });
    }
  };
  
  // Professional heading with enhanced styling
  const drawHeading = (text: string, size = headingSize) => {
    checkPageSpace(lineHeight * 2.5);
    y -= lineHeight;
    
    // Add extra space before heading
    y -= lineHeight * 0.7;
    
    // Draw heading text with primary color
    page.drawText(text.toUpperCase(), {
      x: margin,
      y,
      font: timesRomanBold,
      size,
      color: primaryColor
    });
    
    // Draw decorative underline with gradient effect
    page.drawLine({
      start: { x: margin, y: y - 10 },
      end: { x: margin + timesRomanBold.widthOfTextAtSize(text.toUpperCase(), size) + 15, y: y - 10 },
      thickness: 1.5,
      color: primaryColor,
    });
    
    page.drawLine({
      start: { x: margin, y: y - 13 },
      end: { x: margin + timesRomanBold.widthOfTextAtSize(text.toUpperCase(), size) + 15, y: y - 13 },
      thickness: 0.7,
      color: highlightColor,
    });
    
    y -= lineHeight * 1.2;
  };
  
  // Draw centered header with enhanced styling
  const drawCenteredText = (text: string, font = timesRoman, size = fontSize, yOffset = 0, color = textColor) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (pageWidth - textWidth) / 2,
      y: y + yOffset,
      font,
      size,
      color
    });
  };
  
  // Classic bullet point with decorative style
  const drawBulletPoint = (text: string) => {
    checkPageSpace(lineHeight);
    y -= lineHeight;
    
    // Draw decorative bullet point with color
    page.drawCircle({
      x: margin + 5,
      y: y + 3,
      size: 3,
      color: accentColor,
    });
    
    page.drawText(text, { 
      x: margin + 15, 
      y, 
      font: timesRoman, 
      size: fontSize,
      color: textColor
    });
  };
  
  // --- Professional Header ---
  if (user.profiles.full_name) {
    // Increased top margin for the full name
    y -= lineHeight * 2.0; // Increased from 0.7 to 2.0 for more space at top
    
    drawCenteredText(user.profiles.full_name.toUpperCase(), timesRomanBold, nameSize, 0, primaryColor);
    y -= lineHeight * 1.8;
    
    // Draw decorative border below name
    page.drawLine({
      start: { x: pageWidth * 0.3, y },
      end: { x: pageWidth * 0.7, y },
      thickness: 1.5,
      color: primaryColor,
    });
    
    page.drawLine({
      start: { x: pageWidth * 0.3, y: y - 3 },
      end: { x: pageWidth * 0.7, y: y - 3 },
      thickness: 0.7,
      color: highlightColor,
    });
    
    y -= lineHeight * 1.8;
    
    // Professional contact information layout
    const contactItems = [];
    if (user.profiles.email) contactItems.push(user.profiles.email);
    if (user.personal_details.phone) contactItems.push(user.personal_details.phone);
    if (user.personal_details.address) contactItems.push(user.personal_details.address);
    if (user.personal_details.linkedin) contactItems.push(user.personal_details.linkedin);
    if (user.personal_details.github) contactItems.push(user.personal_details.github);
    if (user.personal_details.website) contactItems.push(user.personal_details.website);
    
    if (contactItems.length > 0) {
      const contactLines = [];
      for (let i = 0; i < contactItems.length; i += 2) {
        const line = contactItems.slice(i, i + 2).join(" • ");
        contactLines.push(line);
      }
      
      contactLines.forEach((line) => {
        drawCenteredText(line, timesRoman, fontSize, 0, accentColor);
        y -= lineHeight;
      });
      y -= lineHeight * 0.5;
    }
  }
  
  // --- Career Objective ---
  if (user.career_objectives && user.career_objectives.length > 0 && user.career_objectives[0].career_objective) {
    drawHeading("Career Objective");
    // Add paragraph with proper margins and first-line indent
    drawParagraph(user.career_objectives[0].career_objective, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor, true);
    y -= sectionSpacing;
  }
  
  // --- Professional Summary ---
  if (user.personal_details && user.personal_details.profile_summary) {
    drawHeading("Professional Summary");
    // Add paragraph with proper margins and first-line indent
    drawParagraph(user.personal_details.profile_summary, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor, true);
    y -= sectionSpacing;
  }
  
  // --- Work Experience ---
  if (user.work_experiences && user.work_experiences.length > 0) {
    drawHeading("Work Experience");
    for (const exp of user.work_experiences) {
      const workText = `${exp.job_title} | ${exp.company}, ${exp.location}`;
      drawParagraph(workText, pageWidth - margin * 2 - 20, timesRomanBold, fontSize, margin + 10, primaryColor);
      
      drawParagraph(`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`, pageWidth - margin * 2 - 20, timesRomanItalic, 10, margin + 10, accentColor);
      
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        for (const r of exp.responsibilities) {
          if (r.value) drawBulletPoint(r.value);
        }
      }
      y -= lineHeight * 0.3;
    }
    y -= sectionSpacing;
  }
  
  // --- Education ---
  if (user.educations && user.educations.length > 0) {
    drawHeading("Education");
    for (const edu of user.educations) {
      const eduText = `${edu.degree} | ${edu.institution}, ${edu.location}`;
      drawParagraph(eduText, pageWidth - margin * 2 - 20, timesRomanBold, fontSize, margin + 10, primaryColor);
      
      const dateText = `${formatDate(edu.start_date)} - ${formatDate(edu.end_date)} | Grade: ${edu.grade}`;
      drawParagraph(dateText, pageWidth - margin * 2 - 20, timesRomanItalic, 10, margin + 10, accentColor);
      y -= lineHeight * 0.3;
    }
    y -= sectionSpacing;
  }
  
  // --- Skills ---
  if (user.skill_sets && user.skill_sets.length > 0) {
    const skills = user.skill_sets[0];
    const hasTechnicalSkills = skills.technical_skills && skills.technical_skills.length > 0;
    const hasSoftSkills = skills.soft_skills && skills.soft_skills.length > 0;
    
    if (hasTechnicalSkills || hasSoftSkills) {
      drawHeading("Skills");
      if (hasTechnicalSkills) {
        const techSkills = skills.technical_skills.map(s => s.value).join(", ");
        drawParagraph(`Technical Skills: ${techSkills}`, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      }
      if (hasSoftSkills) {
        const softSkills = skills.soft_skills.map(s => s.value).join(", ");
        drawParagraph(`Soft Skills: ${softSkills}`, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      }
      y -= sectionSpacing;
    }
  }
  
  // --- Projects ---
  if (user.projects && user.projects.length > 0) {
    drawHeading("Projects");
    for (const proj of user.projects) {
      if (proj.title) drawParagraph(proj.title, pageWidth - margin * 2 - 20, timesRomanBold, fontSize, margin + 10, primaryColor);
      if (proj.description) drawParagraph(proj.description, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor, true);
      if (proj.technologies && proj.technologies.length > 0) {
        drawParagraph(`Technologies: ${proj.technologies.map(t => t.value).join(", ")}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, accentColor);
      }
      if (proj.link) {
        drawParagraph(`Project Link: ${proj.link}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, highlightColor);
      }
      y -= lineHeight * 0.3;
    }
    y -= sectionSpacing;
  }
  
  // --- Languages ---
  if (user.languages && user.languages.length > 0) {
    drawHeading("Languages");
    for (const lang of user.languages) {
      if (lang.language && lang.proficiency) {
        const langText = `Language: ${lang.language} - Proficiency: ${lang.proficiency}`;
        drawParagraph(langText, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      }
    }
    y -= sectionSpacing;
  }
  
  // --- Certificates ---
  if (user.profiles && user.profiles.certificates && user.profiles.certificates.length > 0) {
    drawHeading("Certifications");
    for (const cert of user.profiles.certificates) {
      const certText = `${cert.name} - ${cert.issuer} (${formatDate(cert.date)})`;
      drawParagraph(certText, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      y -= lineHeight * 0.2;
    }
    y -= sectionSpacing;
  }
  
  // --- References ---
  if (user.references && user.references.length > 0) {
    drawHeading("References");
    for (const ref of user.references) {
      const refText = `${ref.name} | ${ref.position} | ${ref.email} | ${ref.phone}`;
      drawParagraph(refText, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      y -= lineHeight * 0.2;
    }
  }
  
  // --- Save PDF ---
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  saveAs(blob, `${user.profiles.full_name || "CV"}_ClassicCV.pdf`);
}
// Minimalist CV Generator
async function generateMinimalistDoc(user: User, type: string) {
  if (type !== "PDF") {
    alert("Only PDF is currently supported for Minimalist CV.");
    return;
  }
  
  const pdfDoc = await PDFDocument.create();
  const pageSize: [number, number] = [595, 842]; // A4
  let page = pdfDoc.addPage(pageSize);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  
  // Professional margins for better visual appeal
  const margin = 60;
  let y = pageHeight - margin;
  
  // Use Times New Roman for a professional look
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  // Professional formatting with improved readability
  const fontSize = 12; // Base font size
  const nameSize = 24; // Larger size for the name
  const headingSize = 14;
  const subheadingSize = 12;
  const lineHeight = fontSize * 1.5; // 1.5 line spacing as requested
  const sectionSpacing = lineHeight * 1.2; // Consistent spacing between sections
  
  // Professional color scheme with subtle accent
  const primaryColor = rgb(0.2, 0.3, 0.5); // Professional blue accent
  const secondaryColor = rgb(0.5, 0.5, 0.5); // Subtle gray for secondary text
  const headingColor = rgb(0.1, 0.1, 0.1); // Dark gray for headings
  const textColor = rgb(0.15, 0.15, 0.15); // Standard text color
  const accentColor = rgb(0.7, 0.2, 0.2); // Red accent for highlights
  
  // Clean white background with elegant border
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(1, 1, 1),
  });
  
  // Add elegant border
  page.drawRectangle({
    x: margin - 15,
    y: margin - 15,
    width: pageWidth - (margin - 15) * 2,
    height: pageHeight - (margin - 15) * 2,
    borderWidth: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Helper function to check if we need a new page
  const checkPageSpace = (requiredSpace: number) => {
    if (y - requiredSpace < margin) {
      page = pdfDoc.addPage(pageSize);
      // Clean white background for new page
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(1, 1, 1),
      });
      // Add elegant border for new page
      page.drawRectangle({
        x: margin - 15,
        y: margin - 15,
        width: pageWidth - (margin - 15) * 2,
        height: pageHeight - (margin - 15) * 2,
        borderWidth: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      y = page.getHeight() - margin;
      return true;
    }
    return false;
  };
  
  // Improved text helper with better word wrapping and paragraph margins
  const drawParagraph = (text: string, maxWidth: number = pageWidth - margin * 2, font = timesRoman, size = fontSize, xPos = margin, color = textColor) => {
    if (!text) return;
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      const lineWidth = font.widthOfTextAtSize(testLine, size);
      if (lineWidth > maxWidth) {
        checkPageSpace(lineHeight);
        y -= lineHeight;
        page.drawText(line, { x: xPos, y, font, size, color });
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      checkPageSpace(lineHeight);
      y -= lineHeight;
      page.drawText(line, { x: xPos, y, font, size, color });
    }
  };
  
  // Modern heading with accent color
  const drawHeading = (text: string) => {
    checkPageSpace(lineHeight * 2.5);
    y -= lineHeight;
    
    // Add extra space before heading
    y -= lineHeight * 0.5;
    
    // Draw heading text with accent color
    page.drawText(text.toUpperCase(), {
      x: margin,
      y,
      font: timesBold,
      size: headingSize,
      color: primaryColor
    });
    
    // Draw modern underline
    page.drawLine({
      start: { x: margin, y: y - 8 },
      end: { x: margin + timesBold.widthOfTextAtSize(text.toUpperCase(), headingSize) + 10, y: y - 8 },
      thickness: 1.5,
      color: primaryColor,
    });
    
    y -= lineHeight;
  };
  
  // Improved bullet point with better spacing
  const drawBulletPoint = (text: string) => {
    checkPageSpace(lineHeight);
    y -= lineHeight;
    page.drawText("•", { 
      x: margin, 
      y, 
      font: timesBold, 
      size: fontSize,
      color: primaryColor
    });
    page.drawText(text, { 
      x: margin + 20, 
      y, 
      font: timesRoman, 
      size: fontSize,
      color: textColor
    });
  };
  
  // Modern date styling with accent color
  const drawRightAlignedText = (text: string, yPos: number) => {
    const textWidth = timesRoman.widthOfTextAtSize(text, 10);
    page.drawText(text, {
      x: pageWidth - margin - textWidth,
      y: yPos,
      font: timesBold,
      size: 10,
      color: primaryColor
    });
  };
  
  // --- PROFESSIONAL HEADER ---
  if (user.profiles && user.profiles.full_name) {
    // Add top margin for the full name
    y -= lineHeight * 0.8;
    
    // Professional name styling
    const nameText = user.profiles.full_name.toUpperCase();
    const nameWidth = timesBold.widthOfTextAtSize(nameText, nameSize);
    
    // Ensure name fits within the document borders
    const maxNameWidth = pageWidth - margin * 2;
    let actualNameSize = nameSize;
    let actualNameWidth = nameWidth;
    
    if (nameWidth > maxNameWidth) {
      // Calculate a font size that will fit within the borders
      actualNameSize = Math.floor(nameSize * (maxNameWidth / nameWidth));
      actualNameWidth = timesBold.widthOfTextAtSize(nameText, actualNameSize);
    }
    
    page.drawText(nameText, {
      x: (pageWidth - actualNameWidth) / 2,
      y,
      font: timesBold,
      size: actualNameSize,
      color: primaryColor
    });
    
    // Add elegant separator line
    y -= lineHeight * 1.5;
    page.drawLine({
      start: { x: pageWidth * 0.25, y },
      end: { x: pageWidth * 0.75, y },
      thickness: 1.5,
      color: primaryColor,
    });
    
    y -= lineHeight * 1.5;
    
    // Professional contact information layout
    const contactItems = [];
    if (user.profiles.email) contactItems.push({ label: "Email", value: user.profiles.email });
    if (user.personal_details && user.personal_details.phone) contactItems.push({ label: "Phone", value: user.personal_details.phone });
    if (user.personal_details && user.personal_details.address) contactItems.push({ label: "Address", value: user.personal_details.address });
    
    const onlineItems = [];
    if (user.personal_details && user.personal_details.linkedin) onlineItems.push({ label: "LinkedIn", value: user.personal_details.linkedin });
    if (user.personal_details && user.personal_details.github) onlineItems.push({ label: "GitHub", value: user.personal_details.github });
    if (user.personal_details && user.personal_details.website) onlineItems.push({ label: "Website", value: user.personal_details.website });
    
    if (contactItems.length > 0 || onlineItems.length > 0) {
      const contactGroups = [];
      if (contactItems.length > 0) contactGroups.push({ title: "Contact", items: contactItems });
      if (onlineItems.length > 0) contactGroups.push({ title: "Online", items: onlineItems });
      
      const columnWidth = (pageWidth - margin * 2) / contactGroups.length;
      let currentX = margin;
      
      contactGroups.forEach(group => {
        // Professional section title
        const titleWidth = timesBold.widthOfTextAtSize(group.title, 10);
        page.drawText(group.title, {
          x: currentX + (columnWidth - titleWidth) / 2,
          y,
          font: timesBold,
          size: 10,
          color: primaryColor
        });
        y -= lineHeight * 0.8;
        
        group.items.forEach(item => {
          const labelWidth = timesBold.widthOfTextAtSize(item.label + ":", 10);
          page.drawText(item.label + ":", {
            x: currentX,
            y,
            font: timesBold,
            size: 10,
            color: secondaryColor
          });
          page.drawText(item.value, {
            x: currentX + labelWidth + 8,
            y,
            font: timesRoman,
            size: 10,
            color: textColor
          });
          y -= lineHeight * 0.8;
        });
        
        currentX += columnWidth;
        y = pageHeight - margin - lineHeight * 3.5;
      });
      y = pageHeight - margin - lineHeight * 6;
    }
  }
  
  // --- PROFILE SUMMARY ---
  if (user.personal_details && user.personal_details.profile_summary) {
    drawHeading("Professional Summary");
    y -= lineHeight * 0.5;
    // Add paragraph with margins from width ends
    drawParagraph(user.personal_details.profile_summary, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
    y -= sectionSpacing;
  }
  
  // --- WORK EXPERIENCE ---
  if (user.work_experiences && user.work_experiences.length > 0) {
    drawHeading("Work Experience");
    y -= lineHeight * 0.5;
    
    user.work_experiences.forEach((exp) => {
      const dateY = y;
      
      if (exp.job_title) {
        drawParagraph(exp.job_title, pageWidth - margin * 2 - 20, timesBold, subheadingSize, margin + 10, headingColor);
      }
      if (exp.company && exp.location) {
        drawParagraph(`${exp.company}, ${exp.location}`, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, secondaryColor);
      }
      
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        y -= lineHeight * 0.3;
        exp.responsibilities.forEach((resp) => {
          if (resp.value) {
            drawBulletPoint(resp.value);
          }
        });
      }
      
      const dateText = `${formatDate(exp.start_date)} — ${formatDate(exp.end_date)}`;
      drawRightAlignedText(dateText, dateY);
      y -= sectionSpacing;
    });
  }
  
  // --- EDUCATION ---
  if (user.educations && user.educations.length > 0) {
    drawHeading("Education");
    y -= lineHeight * 0.5;
    
    user.educations.forEach((edu) => {
      const dateY = y;
      
      if (edu.degree) {
        drawParagraph(edu.degree, pageWidth - margin * 2 - 20, timesBold, subheadingSize, margin + 10, headingColor);
      }
      if (edu.institution && edu.location) {
        drawParagraph(`${edu.institution}, ${edu.location}`, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, secondaryColor);
      }
      if (edu.grade) {
        drawParagraph(`Grade: ${edu.grade}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, secondaryColor);
      }
      
      const dateText = `${formatDate(edu.start_date)} — ${formatDate(edu.end_date)}`;
      drawRightAlignedText(dateText, dateY);
      y -= sectionSpacing;
    });
  }
  
  // --- SKILLS ---
  if (user.skill_sets && user.skill_sets.length > 0) {
    const skills = user.skill_sets[0];
    const hasTechnicalSkills = skills.technical_skills && skills.technical_skills.length > 0;
    const hasSoftSkills = skills.soft_skills && skills.soft_skills.length > 0;
    
    if (hasTechnicalSkills || hasSoftSkills) {
      drawHeading("Skills");
      
      if (hasTechnicalSkills) {
        drawParagraph("Technical Skills:", pageWidth - margin * 2 - 20, timesBold, fontSize, margin + 10, headingColor);
        const techText = skills.technical_skills.map(s => s.value).join(", ");
        drawParagraph(techText, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
        y -= lineHeight * 0.3;
      }
      
      if (hasSoftSkills) {
        drawParagraph("Soft Skills:", pageWidth - margin * 2 - 20, timesBold, fontSize, margin + 10, headingColor);
        const softText = skills.soft_skills.map(s => s.value).join(", ");
        drawParagraph(softText, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      }
      y -= sectionSpacing;
    }
  }
  
  // --- PROJECTS ---
  if (user.projects && user.projects.length > 0) {
    drawHeading("Projects");
    y -= lineHeight * 0.5;
    
    user.projects.forEach((project) => {
      if (project.title) {
        drawParagraph(project.title, pageWidth - margin * 2 - 20, timesBold, subheadingSize, margin + 10, headingColor);
      }
      if (project.description) {
        drawParagraph(project.description, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
      }
      
      if (project.technologies && project.technologies.length > 0) {
        const techText = project.technologies.map(t => t.value).join(", ");
        drawParagraph(`Technologies: ${techText}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, secondaryColor);
      }
      
      if (project.link) {
        drawParagraph(`Project Link: ${project.link}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, accentColor);
      }
      y -= sectionSpacing;
    });
  }
  
  // --- LANGUAGES ---
  if (user.languages && user.languages.length > 0) {
    const hasLanguages = user.languages.some(lang => lang.language && lang.proficiency);
    if (hasLanguages) {
      drawHeading("Languages");
      user.languages.forEach((lang) => {
        if (lang.language && lang.proficiency) {
          drawParagraph(`${lang.language}: ${lang.proficiency}`, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, textColor);
        }
      });
      y -= sectionSpacing;
    }
  }
  
  // --- CERTIFICATIONS ---
  if (user.profiles && user.profiles.certificates && user.profiles.certificates.length > 0) {
    drawHeading("Certifications");
    user.profiles.certificates.forEach((cert) => {
      if (cert.name) {
        drawParagraph(cert.name, pageWidth - margin * 2 - 20, timesBold, fontSize, margin + 10, headingColor);
      }
      if (cert.issuer && cert.date) {
        drawParagraph(`${cert.issuer} · ${formatDate(cert.date)}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, secondaryColor);
      }
      y -= lineHeight * 0.3;
    });
    y -= sectionSpacing;
  }
  
  // --- REFERENCES ---
  if (user.references && user.references.length > 0) {
    drawHeading("References");
    user.references.forEach((ref) => {
      if (ref.name) {
        drawParagraph(ref.name, pageWidth - margin * 2 - 20, timesBold, fontSize, margin + 10, headingColor);
      }
      if (ref.position) {
        drawParagraph(ref.position, pageWidth - margin * 2 - 20, timesRoman, fontSize, margin + 10, secondaryColor);
      }
      if (ref.email || ref.phone) {
        drawParagraph(`${ref.email || ''} ${ref.email && ref.phone ? '·' : ''} ${ref.phone || ''}`, pageWidth - margin * 2 - 20, timesRoman, fontSize - 1, margin + 10, secondaryColor);
      }
      y -= lineHeight * 0.3;
    });
  }
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  saveAs(blob, `${user.profiles?.full_name || "CV"}_MinimalistCV.pdf`);
}
// Modern CV Generator
// Modern CV Generator
// Modern CV Generator
// Modern CV Generator
// Modern CV Generator
// Modern CV Generator
async function generateModernDoc(user: User, type: string) {
  if (type !== "PDF") {
    alert("Only PDF is currently supported for Modern CV.");
    return;
  }
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const margin = 50;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const columnGap = 25; // Increased gap for better separation
  
  // Calculate column widths to ensure left is 1/3 and right is 2/3 of the content area
  const contentWidth = pageWidth - margin * 2;
  const leftColumnWidth = contentWidth / 3;
  const rightColumnWidth = (contentWidth * 2) / 3;
  
  // Track current pages for each column
  let leftPage = page;
  let rightPage = page;
  let yLeft = pageHeight - margin;
  let yRight = pageHeight - margin;
  
  // Use Times New Roman font for a more professional look
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  const fontSize = 12;
  const headingColor = rgb(0.2, 0.3, 0.5); // More professional blue color
  const lineHeight = fontSize * 1.6; // Increased line height for better readability
  const sidebarLineHeight = fontSize * 1.3; // Compact spacing for left column
  
  // Professional color scheme - RESTORED ORIGINAL COLORS
  const sidebarColor = rgb(0.05, 0.4, 0.4); // Original dark teal for sidebar
  const headerColor = rgb(0.05, 0.4, 0.4); // Original dark teal for header
  const textColor = rgb(0.15, 0.15, 0.15); // Darker text for better contrast
  const sidebarTextColor = rgb(1, 1, 1); // White text for sidebar
  
  // Draw template background
  // White background for main content
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(1, 1, 1),
  });
  
  // Draw sidebar background (now left side) - exactly 1/3 of content width
  page.drawRectangle({
    x: 0,
    y: 0,
    width: margin + leftColumnWidth,
    height: pageHeight,
    color: sidebarColor,
  });
  
  // Draw header section
  page.drawRectangle({
    x: 0,
    y: pageHeight - 120,
    width: margin + leftColumnWidth,
    height: 120,
    color: headerColor,
  });
  
  // Helper function to draw text on a specific page
  const drawText = (text: string, x: number, y: number, font = timesRoman, size = fontSize, color = textColor, targetPage = page) => {
    if (!text) return;
    targetPage.drawText(text, { x, y, font, size, color });
  };
  
  // Helper to check if we need a new page for left column
  const checkLeftPageSpace = (requiredSpace: number) => {
    if (yLeft - requiredSpace < margin) {
      leftPage = pdfDoc.addPage([595, 842]);
      // Draw background for new page
      leftPage.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(1, 1, 1),
      });
      leftPage.drawRectangle({
        x: 0,
        y: 0,
        width: margin + leftColumnWidth,
        height: pageHeight,
        color: sidebarColor,
      });
      yLeft = leftPage.getHeight() - margin;
      return true;
    }
    return false;
  };
  
  // Helper to check if we need a new page for right column
  const checkRightPageSpace = (requiredSpace: number) => {
    if (yRight - requiredSpace < margin) {
      rightPage = pdfDoc.addPage([595, 842]);
      // Draw background for new page
      rightPage.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(1, 1, 1),
      });
      rightPage.drawRectangle({
        x: 0,
        y: 0,
        width: margin + leftColumnWidth,
        height: pageHeight,
        color: sidebarColor,
      });
      yRight = rightPage.getHeight() - margin;
      return true;
    }
    return false;
  };
  
  // Professional style formatted heading for left column
  const addSectionLeft = (title: string, marginTop = sidebarLineHeight) => {
    const requiredSpace = marginTop + sidebarLineHeight + 15;
    checkLeftPageSpace(requiredSpace);
    yLeft -= marginTop;
    // Use the same x-position as the full name (centered in the left column)
    const nameWidth = timesBold.widthOfTextAtSize(user.profiles?.full_name?.toUpperCase() || "NAME", 18);
    const nameX = (margin + leftColumnWidth - nameWidth) / 2;
    drawText(title.toUpperCase(), nameX, yLeft, timesBold, fontSize + 2, sidebarTextColor, leftPage);
    const linePadding = 8;
    const lineY = yLeft - linePadding;
    leftPage.drawLine({
      start: { x: nameX, y: lineY },
      end: { x: nameX + timesBold.widthOfTextAtSize(title.toUpperCase(), fontSize + 2), y: lineY },
      thickness: 1.2,
      color: rgb(0.7, 0.9, 0.9),
    });
    yLeft -= sidebarLineHeight + linePadding;
  };
  
  // Professional style formatted heading for right column
  const addSectionRight = (title: string, marginTop = lineHeight) => {
    const requiredSpace = marginTop + lineHeight + 15;
    checkRightPageSpace(requiredSpace);
    yRight -= marginTop;
    drawText(title.toUpperCase(), margin + leftColumnWidth + columnGap, yRight, timesBold, fontSize + 2, headingColor, rightPage);
    const linePadding = 8; // same padding as left
    const lineY = yRight - linePadding;
    rightPage.drawLine({
      start: { x: margin + leftColumnWidth + columnGap, y: lineY },
      end: { x: margin + leftColumnWidth + columnGap + rightColumnWidth, y: lineY },
      thickness: 1.2,
      color: headingColor,
    });
    yRight -= lineHeight + linePadding;
  };
  
  // Professional paragraph formatting for left column with proper alignment and margins
  const addParagraphLeft = (text: string, indent = false) => {
    if (!text) return;
    
    const indentSize = indent ? 15 : 0;
    // Calculate the same x-position as the full name (centered in the left column)
    const nameWidth = timesBold.widthOfTextAtSize(user.profiles?.full_name?.toUpperCase() || "NAME", 18);
    const nameX = (margin + leftColumnWidth - nameWidth) / 2;
    const leftMargin = nameX;
    
    // FIXED: Calculate max width to ensure text doesn't exceed column boundaries with proper margins
    const maxWidth = leftColumnWidth - (nameX - margin) - 10; // Added 10pt right margin
    
    // Split text into words
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = timesRoman.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxWidth) {
        // If adding this word would exceed the max width, push the current line and start a new one
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // If a single word is too long, we have to use it anyway
          lines.push(word);
        }
      } else {
        currentLine = testLine;
      }
    }
    
    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw each line with proper alignment
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      checkLeftPageSpace(sidebarLineHeight);
      
      // Calculate x position with proper indentation
      const xPos = leftMargin + (i === 0 && indent ? indentSize : 0);
      
      drawText(line, xPos, yLeft, timesRoman, fontSize, sidebarTextColor, leftPage);
      yLeft -= sidebarLineHeight;
    }
    
    // Add space after paragraph
    yLeft -= sidebarLineHeight * 0.5; // Increased spacing for better readability
  };
  
  // Professional paragraph formatting for right column with proper alignment and margins
  const addParagraphRight = (text: string, indent = false) => {
    if (!text) return;
    
    const indentSize = indent ? 15 : 0;
    const leftMargin = margin + leftColumnWidth + columnGap;
    const maxWidth = rightColumnWidth - 10; // Added 10pt right margin
    
    // Split text into words
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = timesRoman.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxWidth) {
        // If adding this word would exceed the max width, push the current line and start a new one
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // If a single word is too long, we have to use it anyway
          lines.push(word);
        }
      } else {
        currentLine = testLine;
      }
    }
    
    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw each line with proper alignment
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      checkRightPageSpace(lineHeight);
      
      // Calculate x position with proper indentation
      const xPos = leftMargin + (i === 0 && indent ? indentSize : 0);
      
      drawText(line, xPos, yRight, timesRoman, fontSize, textColor, rightPage);
      yRight -= lineHeight;
    }
  };
  
  // Professional bullet points for right column with proper alignment and margins
  const addBulletPointRight = (text: string) => {
    if (!text) return;
    
    const bulletX = margin + leftColumnWidth + columnGap;
    const textIndent = 18; // space after bullet
    const leftMargin = bulletX + textIndent;
    const maxWidth = rightColumnWidth - textIndent - 10; // Added 10pt right margin
    
    // Split text into words
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = timesRoman.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxWidth) {
        // If adding this word would exceed the max width, push the current line and start a new one
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // If a single word is too long, we have to use it anyway
          lines.push(word);
        }
      } else {
        currentLine = testLine;
      }
    }
    
    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw each line with proper alignment
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      checkRightPageSpace(lineHeight);
      
      // Draw bullet for the first line
      if (i === 0) {
        drawText("•", bulletX, yRight, timesRoman, fontSize, textColor, rightPage);
      }
      
      // Draw text
      drawText(line, leftMargin, yRight, timesRoman, fontSize, textColor, rightPage);
      yRight -= lineHeight;
    }
  };
  
  // --- Header ---
  if (user.profiles && user.profiles.full_name) {
    // Professional style: Title in bold, centered
    const nameWidth = timesBold.widthOfTextAtSize(user.profiles.full_name.toUpperCase(), 18);
    const nameX = (margin + leftColumnWidth - nameWidth) / 2;
    drawText(user.profiles.full_name.toUpperCase(), nameX, yLeft, timesBold, 18, sidebarTextColor, leftPage);
    yLeft -= lineHeight * 1.5;
    
    // Career objectives if available
    if (user.career_objectives && user.career_objectives.length > 0 && user.career_objectives[0].career_objective) {
      addParagraphLeft(user.career_objectives[0].career_objective, true);
    }
    
    // Contact information section
    addSectionLeft("Contact Information");
    yLeft -= sidebarLineHeight * 0.7;
    
    if (user.profiles.email) {
      addParagraphLeft(`Email: ${user.profiles.email}`);
    }
    if (user.personal_details && user.personal_details.phone) {
      addParagraphLeft(`Phone: ${user.personal_details.phone}`);
    }
    if (user.personal_details && user.personal_details.address) {
      addParagraphLeft(`Address: ${user.personal_details.address}`);
    }
    if (user.personal_details && user.personal_details.linkedin) {
      addParagraphLeft(`LinkedIn: ${user.personal_details.linkedin}`);
    }
    if (user.personal_details && user.personal_details.github) {
      addParagraphLeft(`GitHub: ${user.personal_details.github}`);
    }
    if (user.personal_details && user.personal_details.website) {
      addParagraphLeft(`Website: ${user.personal_details.website}`);
    }
  }
  
  // --- Right Column: Main Content ---
  if (user.personal_details && user.personal_details.profile_summary) {
    addSectionRight("Professional Summary");
    yRight -= lineHeight * 0.7;
    addParagraphRight(user.personal_details.profile_summary, true);
    yRight -= lineHeight * 0.7;
  }
  
  if (user.work_experiences && user.work_experiences.length > 0) {
    addSectionRight("Work Experience");
    yRight -= lineHeight * 0.7;
    
    user.work_experiences.forEach(exp => {
      // Professional style: Job title in bold
      if (exp.job_title) {
        drawText(exp.job_title, margin + leftColumnWidth + columnGap, yRight, timesBold, fontSize + 2, textColor, rightPage);
        yRight -= lineHeight;
      }
      
      // Company and location
      if (exp.company && exp.location) {
        drawText(`${exp.company}, ${exp.location}`, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize, rgb(0.3, 0.3, 0.3), rightPage);
        yRight -= lineHeight;
      }
      
      // Date range
      if (exp.start_date && exp.end_date) {
        drawText(`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize - 1, rgb(0.5, 0.5, 0.5), rightPage);
        yRight -= lineHeight;
      }
      
      // Responsibilities as bullet points
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        yRight -= lineHeight * 0.4; // Small space before bullets
        exp.responsibilities.forEach(r => {
          if (r.value) {
            addBulletPointRight(r.value);
          }
        });
      }
      
      yRight -= lineHeight * 0.7; // Space between experiences
    });
  }
  
  if (user.educations && user.educations.length > 0) {
    addSectionRight("Education");
    yRight -= lineHeight * 0.7;
    
    user.educations.forEach(edu => {
      // Professional style: Degree in bold
      if (edu.degree) {
        drawText(edu.degree, margin + leftColumnWidth + columnGap, yRight, timesBold, fontSize + 2, textColor, rightPage);
        yRight -= lineHeight;
      }
      
      // Institution and location
      if (edu.institution && edu.location) {
        drawText(`${edu.institution}, ${edu.location}`, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize, rgb(0.3, 0.3, 0.3), rightPage);
        yRight -= lineHeight;
      }
      
      // Date range and grade
      if (edu.start_date && edu.end_date) {
        const dateText = edu.grade 
          ? `${formatDate(edu.start_date)} - ${formatDate(edu.end_date)} | Grade: ${edu.grade}`
          : `${formatDate(edu.start_date)} - ${formatDate(edu.end_date)}`;
          
        drawText(dateText, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize - 1, rgb(0.5, 0.5, 0.5), rightPage);
        yRight -= lineHeight;
      }
      
      yRight -= lineHeight * 0.5; // Space between education entries
    });
  }
  
  if (user.projects && user.projects.length > 0) {
    addSectionRight("Projects");
    yRight -= lineHeight * 0.7;
    
    user.projects.forEach(proj => {
      // Professional style: Project title in bold
      if (proj.title) {
        drawText(proj.title, margin + leftColumnWidth + columnGap, yRight, timesBold, fontSize + 2, textColor, rightPage);
        yRight -= lineHeight;
      }
      
      // Description
      if (proj.description) {
        addParagraphRight(proj.description, true);
      }
      
      // Project link
      if (proj.link) {
        drawText(`Project Link: ${proj.link}`, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize - 1, rgb(0, 0, 0.7), rightPage);
        yRight -= lineHeight;
      }
      
      // Technologies
      if (proj.technologies && proj.technologies.length > 0) {
        const techText = `Technologies: ${proj.technologies.map(t => t.value).join(", ")}`;
        drawText(techText, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize - 1, rgb(0.5, 0.5, 0.5), rightPage);
        yRight -= lineHeight;
      }
      
      yRight -= lineHeight * 0.5; // Space between projects
    });
  }
  
  // --- Left Column: Sidebar ---
  if (user.skill_sets && user.skill_sets.length > 0) {
    const skills = user.skill_sets[0];
    const hasTechnicalSkills = skills.technical_skills && skills.technical_skills.length > 0;
    const hasSoftSkills = skills.soft_skills && skills.soft_skills.length > 0;
    
    if (hasTechnicalSkills || hasSoftSkills) {
      addSectionLeft("Skills");
      yLeft -= sidebarLineHeight * 0.7;
      
      if (hasTechnicalSkills) {
        // Professional style: Subheading in bold
        const nameWidth = timesBold.widthOfTextAtSize(user.profiles?.full_name?.toUpperCase() || "NAME", 18);
        const nameX = (margin + leftColumnWidth - nameWidth) / 2;
        drawText("Technical Skills:", nameX, yLeft, timesBold, fontSize, sidebarTextColor, leftPage);
        yLeft -= sidebarLineHeight;
        addParagraphLeft(skills.technical_skills.map(s => s.value).join(", "));
      }
      
      if (hasSoftSkills) {
        const nameWidth = timesBold.widthOfTextAtSize(user.profiles?.full_name?.toUpperCase() || "NAME", 18);
        const nameX = (margin + leftColumnWidth - nameWidth) / 2;
        drawText("Soft Skills:", nameX, yLeft, timesBold, fontSize, sidebarTextColor, leftPage);
        yLeft -= sidebarLineHeight;
        addParagraphLeft(skills.soft_skills.map(s => s.value).join(", "));
      }
    }
  }
  
  if (user.languages && user.languages.length > 0) {
    const hasLanguages = user.languages.some(lang => lang.language && lang.proficiency);
    if (hasLanguages) {
      addSectionLeft("Languages");
      yLeft -= sidebarLineHeight * 0.7;
      
      user.languages.forEach(l => {
        if (l.language && l.proficiency) {
          addParagraphLeft(`${l.language}: ${l.proficiency}`);
        }
      });
    }
  }
  
  if (user.profiles && user.profiles.certificates && user.profiles.certificates.length > 0) {
    addSectionLeft("Certificates");
    yLeft -= sidebarLineHeight * 0.7;
    
    user.profiles.certificates.forEach(c => {
      if (c.name && c.issuer && c.date) {
        // Professional style: Certificate name in bold
        const nameWidth = timesBold.widthOfTextAtSize(user.profiles?.full_name?.toUpperCase() || "NAME", 18);
        const nameX = (margin + leftColumnWidth - nameWidth) / 2;
        drawText(c.name, nameX, yLeft, timesBold, fontSize, sidebarTextColor, leftPage);
        yLeft -= sidebarLineHeight;
        addParagraphLeft(`${c.issuer} (${formatDate(c.date)})`);
      }
    });
  }
  
  if (user.references && user.references.length > 0) {
    addSectionLeft("References");
    yLeft -= sidebarLineHeight * 0.7;
    
    user.references.forEach(r => {
      // Professional style: Reference name in bold
      const nameWidth = timesBold.widthOfTextAtSize(user.profiles?.full_name?.toUpperCase() || "NAME", 18);
      const nameX = (margin + leftColumnWidth - nameWidth) / 2;
      drawText(r.name, nameX, yLeft, timesBold, fontSize, sidebarTextColor, leftPage);
      yLeft -= sidebarLineHeight;
      
      if (r.position) {
        addParagraphLeft(r.position);
      }
      
      if (r.email || r.phone) {
        const contactInfo = [r.email, r.phone].filter(Boolean).join(" | ");
        addParagraphLeft(contactInfo);
      }
      
      yLeft -= sidebarLineHeight * 0.5; // Space between references
    });
  }
  
  // --- Save PDF ---
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  saveAs(blob, `${user.profiles?.full_name || "CV"}_ModernCV.pdf`);
}
// Document generators object
const documentGenerators = {
  'finance-cv': generateClassicDoc,
  'minimalist-cv': generateMinimalistDoc,
  'modern-cv': generateModernDoc,
};

const TemplateBrowser = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: selectedCV, loading, error } = useCurrentUserCV();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const selectedCategory = categories.find((c) => c.id === activeCategory);
  const [showModal, setShowModal] = useState(false);
  const [SelectedTemplateComponent, setSelectedTemplateComponent] =
    useState<React.FC<{ data: User }> | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [showUseOptions, setShowUseOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [signInIsOpen, setSignInIsOpen] = useState(!user);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const closeSignIn = () => setSignInIsOpen(false);
  
  // If token is invalid -> open SignIn modal
  useEffect(() => {
    if (error && typeof error === "object" && "detail" in error) {
      if (error.detail === "Invalid token.") {
        setSignInIsOpen(true);
      }
    }
  }, [error]);
  
  
  const handlePreview = (
    templateId: string,
    templateComponent: React.FC<{ data: User }>
  ) => {
    if (!selectedCV) return;
    const template = selectedCategory?.templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
    setSelectedTemplateId(templateId);
    setSelectedTemplateComponent(() => templateComponent);
    setShowModal(true);
    setShowUseOptions(false);
  };
  
  const handleGenerate = async (type: string) => {
    if (!selectedCV || !selectedTemplateId) return;
    
    setIsGenerating(true);
    const generator = documentGenerators[selectedTemplateId as keyof typeof documentGenerators];
    
    if (!generator) {
      alert("No generator available for this template.");
      setIsGenerating(false);
      return;
    }
    
    try {
      // Always generate PDF first
      await generator(selectedCV, "PDF");
      
      // If non-PDF type requested, show message about conversion
      if (type !== "PDF") {
        alert(`Conversion to ${type} will be available soon. For now, a PDF has been generated.`);
      }
    } catch (err) {
      console.error("Error generating document:", err);
      alert("Failed to generate document. Check console for details.");
    } finally {
      setShowUseOptions(false);
      setIsGenerating(false);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUseOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // 🔑 Auth check: show SignIn modal if not authenticated
  if (!user || signInIsOpen) {
    return <SignIn onClose={closeSignIn} />;
  }
  
  // 🔄 Always show loading spinner after auth until CV is fetched
  if (loading || !selectedCV) {
    return (
      <main className="p-6 container mx-auto min-h-screen flex items-center justify-center">
        <ClipLoader color="#0f62fe" size={50} />
      </main>
    );
  }
  
  // ❌ Only show error if loading is false and still no CV
  if (!loading && error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : "detail" in error
        ? error.detail
        : "Failed to load CV";
    return (
      <main className="p-6 container mx-auto min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load CV: {errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </main>
    );
  }
  
  return (
    <main className="mt-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Professional CV Templates
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Choose from our professionally designed templates and create a stunning CV that stands out from the crowd.
        </p>
        
   
        
        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-lg shadow p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {selectedCategory?.templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Template Preview */}
              <div className={`h-48 bg-gradient-to-br ${template.previewColor} p-4 flex items-center justify-center`}>
                <div className="text-4xl">{template.previewIcon}</div>
              </div>
              
              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    label="Preview"
                    className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => handlePreview(template.id, template.component)}
                  />
                  
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setSelectedTemplateId(template.id);
                      setSelectedTemplateComponent(() => template.component);
                      setShowModal(true);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Template Comparison Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Template Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  {selectedCategory?.templates.map((template) => (
                    <th key={template.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {template.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Design Style</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Clean & Minimal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Modern & Professional</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Classic & Formal</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Best For</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Creative Industries</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Tech & Business</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Finance & Law</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Layout</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Single Column</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Two Column</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Single Column</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Color Scheme</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Monochrome</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Teal & White</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Blue & White</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal with Template Preview */}
      {SelectedTemplateComponent && selectedTemplate && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Template Preview */}
            <div className="lg:w-2/3 bg-white p-4 rounded-lg shadow-inner overflow-auto max-h-[70vh]">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">{selectedTemplate.name}</h2>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <SelectedTemplateComponent data={selectedCV} />
              </div>
            </div>
            
            {/* Template Actions and Info */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Template Actions</h3>
                
                <div className="space-y-4">
                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setShowUseOptions((prev) => !prev)}
                      disabled={isGenerating}
                      className={`w-full flex items-center justify-center gap-2 ${
                        isGenerating 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700"
                      } text-white px-4 py-3 rounded-lg shadow transition`}
                    >
                      {isGenerating && <ClipLoader color="white" size={16} />}
                      {isGenerating ? "Generating..." : "Use This Template"}
                    </button>
                    
                    {showUseOptions && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        {documentTypes.map((type) => (
                          <button
                            key={type}
                            className="block w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                            onClick={() => handleGenerate(type)}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow transition"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
              
              {/* Template Features */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Template Features</h3>
                <ul className="space-y-2">
                  {selectedTemplate.id === 'minimalist-cv' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Clean and minimal design</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Ample whitespace for readability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Professional typography</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Ideal for creative industries</span>
                      </li>
                    </>
                  )}
                  
                  {selectedTemplate.id === 'modern-cv' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Two-column layout design</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Sidebar for contact and skills</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Modern color scheme</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Perfect for tech and business roles</span>
                      </li>
                    </>
                  )}
                  
                  {selectedTemplate.id === 'finance-cv' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Classic and formal design</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Traditional layout structure</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Professional blue accents</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Tailored for finance and legal sectors</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};
export default TemplateBrowser;