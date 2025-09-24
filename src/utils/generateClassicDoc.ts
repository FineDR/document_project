import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import type { User } from "../types/cv/cv";

/**
 * Generate a Classic CV PDF matching the React template design.
 */
export async function generateClassicDoc(user: User, type: string) {
  if (type !== "PDF") {
    alert("Currently only PDF export is supported for Classic CV.");
    return;
  }
  const pdfDoc = await PDFDocument.create();
  const pageSize: [number, number] = [595, 842]; // A4
  let page = pdfDoc.addPage(pageSize);

  // Standard margins matching the template
  const margin = 50;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  let y = pageHeight - margin;

  // Use Times New Roman font
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // APA style formatting
  const fontSize = 12;
  const lineHeight = fontSize * 1.5; // 1.5 line spacing
  const headingColor = rgb(0.1, 0.3, 0.8); // Blue color for headings
  const nameColor = rgb(0.1, 0.3, 0.8); // Blue color for name

  // Helper function to check if we need a new page
  const checkPageSpace = (requiredSpace: number) => {
    if (y - requiredSpace < margin) {
      page = pdfDoc.addPage(pageSize);
      y = page.getHeight() - margin;
      return true;
    }
    return false;
  };

  // Draw text helper with auto line wrapping
  const drawParagraph = (text: string, maxWidth: number = pageWidth - margin * 2, font = timesRoman, size = fontSize, xPos = margin) => {
    if (!text) return;

    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      const lineWidth = font.widthOfTextAtSize(testLine, size);

      if (lineWidth > maxWidth) {
        checkPageSpace(lineHeight);
        y -= lineHeight;
        page.drawText(line, { x: xPos, y, font, size });
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      checkPageSpace(lineHeight);
      y -= lineHeight;
      page.drawText(line, { x: xPos, y, font, size });
    }
  };

  // Draw heading without underline
  const drawHeading = (text: string, size = fontSize + 2) => {
    checkPageSpace(lineHeight * 2);
    y -= lineHeight; // Reduced space before heading for smoother flow

    // Draw heading text
    page.drawText(text.toUpperCase(), {
      x: margin,
      y,
      font: timesRomanBold,
      size,
      color: headingColor
    });

    y -= lineHeight; // Reduced space after heading for smoother flow
  };

  // Draw centered header
  const drawCenteredText = (text: string, font = timesRoman, size = fontSize, yOffset = 0, color = rgb(0, 0, 0)) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (pageWidth - textWidth) / 2,
      y: y + yOffset,
      font,
      size,
      color
    });
  };

  // Draw bullet point
  const drawBulletPoint = (text: string) => {
    checkPageSpace(lineHeight);
    y -= lineHeight;
    page.drawText("•", { x: margin, y, font: timesRoman, size: fontSize });
    page.drawText(text, { x: margin + 15, y, font: timesRoman, size: fontSize });
  };

  // --- Header with thick border ---
  // Name in uppercase, centered, and blue
  if (user.profiles.full_name) {
    drawCenteredText(user.profiles.full_name.toUpperCase(), timesRomanBold, 18, 0, nameColor);
    y -= lineHeight * 1.5;

    // Draw thick border below name
    page.drawLine({
      start: { x: margin, y: y - 5 },
      end: { x: pageWidth - margin, y: y - 5 },
      thickness: 4,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= lineHeight * 1.5;

    // Contact information - only include non-empty fields
    const contactItems = [];
    if (user.profiles.email) contactItems.push(`Email: ${user.profiles.email}`);
    if (user.personal_details.phone) contactItems.push(`Phone: ${user.personal_details.phone}`);
    if (user.personal_details.address) contactItems.push(`Address: ${user.personal_details.address}`);
    if (user.personal_details.linkedin) contactItems.push(`LinkedIn: ${user.personal_details.linkedin}`);
    if (user.personal_details.github) contactItems.push(`GitHub: ${user.personal_details.github}`);
    if (user.personal_details.website) contactItems.push(`Website: ${user.personal_details.website}`);

    // Only draw contact information if there are items
    if (contactItems.length > 0) {
      // Group contact items in lines of 2 items each
      const contactLines = [];
      for (let i = 0; i < contactItems.length; i += 2) {
        const line = contactItems.slice(i, i + 2).join(" | ");
        contactLines.push(line);
      }

      // Draw each contact line centered
      contactLines.forEach((line) => {
        drawCenteredText(line, timesRoman, fontSize);
        y -= lineHeight;
      });

      y -= lineHeight * 0.5; // Reduced space after header for smoother flow
    }
  }

  // --- Career Objective ---
  if (user.career_objectives && user.career_objectives.length > 0 && user.career_objectives[0].career_objective) {
    drawHeading("Career Objective");
    drawParagraph(user.career_objectives[0].career_objective);
    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- Professional Summary ---
  if (user.personal_details && user.personal_details.profile_summary) {
    drawHeading("Professional Summary");
    drawParagraph(user.personal_details.profile_summary);
    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- Work Experience ---
  if (user.work_experiences && user.work_experiences.length > 0) {
    drawHeading("Work Experience");

    for (const exp of user.work_experiences) {
      // Job title, company, location, and date all inline (not bold)
      const workText = `${exp.job_title} | ${exp.company}, ${exp.location} | ${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`;
      drawParagraph(workText, pageWidth - margin * 2, timesRoman);

      // Responsibilities with bullet points
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        for (const r of exp.responsibilities) {
          if (r.value) drawBulletPoint(r.value);
        }
      }

      y -= lineHeight / 3; // Reduced space between entries for smoother flow
    }

    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- Education ---
  if (user.educations && user.educations.length > 0) {
    drawHeading("Education");

    for (const edu of user.educations) {
      // Degree, institution, location, date, and grade all inline (not bold)
      const eduText = `${edu.degree} | ${edu.institution}, ${edu.location} | ${formatDate(edu.start_date)} - ${formatDate(edu.end_date)} | Grade: ${edu.grade}`;
      drawParagraph(eduText, pageWidth - margin * 2, timesRoman);

      y -= lineHeight / 3; // Reduced space between entries for smoother flow
    }

    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- Skills ---
  if (user.skill_sets && user.skill_sets.length > 0) {
    const skills = user.skill_sets[0];
    const hasTechnicalSkills = skills.technical_skills && skills.technical_skills.length > 0;
    const hasSoftSkills = skills.soft_skills && skills.soft_skills.length > 0;

    if (hasTechnicalSkills || hasSoftSkills) {
      drawHeading("Skills");

      // Technical and soft skills inline (not bold)
      const techSkills = hasTechnicalSkills ? skills.technical_skills.map(s => s.value).join(", ") : "None";
      const softSkills = hasSoftSkills ? skills.soft_skills.map(s => s.value).join(", ") : "None";
      const skillsText = `Technical Skills: ${techSkills} | Soft Skills: ${softSkills}`;
      drawParagraph(skillsText);

      y -= lineHeight / 2; // Reduced space after section for smoother flow
    }
  }

  // --- Projects ---
  if (user.projects && user.projects.length > 0) {
    drawHeading("Projects");

    for (const proj of user.projects) {
      // Project title (not bold)
      if (proj.title) drawParagraph(proj.title, pageWidth - margin * 2, timesRoman);
      if (proj.description) drawParagraph(proj.description);

      if (proj.technologies && proj.technologies.length > 0) {
        drawParagraph(`Technologies: ${proj.technologies.map(t => t.value).join(", ")}`, pageWidth - margin * 2, timesRoman, fontSize - 1);
      }

      // Add project link if available
      if (proj.link) {
        drawParagraph(`Project Link: ${proj.link}`, pageWidth - margin * 2, timesRoman, fontSize - 1);
      }

      y -= lineHeight / 3; // Reduced space between entries for smoother flow
    }

    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- Languages ---
  if (user.languages && user.languages.length > 0) {
    drawHeading("Languages");

    // Display each language as a normal paragraph
    for (const lang of user.languages) {
      if (lang.language && lang.proficiency) {
        const langText = `Language: ${lang.language} - Proficiency: ${lang.proficiency}`;
        drawParagraph(langText);
      }
    }

    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- Certificates ---
  if (user.profiles && user.profiles.certificates && user.profiles.certificates.length > 0) {
    drawHeading("Certifications");

    for (const cert of user.profiles.certificates) {
      // Certificate name, issuer, and date all inline
      const certText = `* ${cert.name} - ${cert.issuer} (${formatDate(cert.date)})`;
      drawParagraph(certText, pageWidth - margin * 2, timesRoman);

      y -= lineHeight / 3; // Reduced space between entries for smoother flow
    }

    y -= lineHeight / 2; // Reduced space after section for smoother flow
  }

  // --- References ---
  if (user.references && user.references.length > 0) {
    drawHeading("References");

    for (const ref of user.references) {
      // All reference information inline (not bold)
      const refText = `${ref.name} | ${ref.position} | ${ref.email} | ${ref.phone}`;
      drawParagraph(refText, pageWidth - margin * 2, timesRoman);

      y -= lineHeight / 3; // Reduced space between entries for smoother flow
    }
  }

  // --- Save PDF ---
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  saveAs(blob, `${user.profiles.full_name || "CV"}_ClassicCV.pdf`);

}

// Helper function to format dates
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}