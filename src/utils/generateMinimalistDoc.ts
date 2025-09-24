import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import type { User } from "../types/cv/cv";

export async function generateMinimalistDoc(user: User, type: string) {
  if (type !== "PDF") {
    alert("Only PDF is currently supported for Minimalist CV.");
    return;
  }
  const pdfDoc = await PDFDocument.create();
  const pageSize: [number, number] = [595, 842]; // A4
  let page = pdfDoc.addPage(pageSize);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Standard margins matching APA style
  const margin = 50;
  let y = pageHeight - margin;

  // Use Times New Roman font
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // APA style formatting
  const fontSize = 12;
  const lineHeight = fontSize * 1.5; // 1.5 line spacing
  const headingColor = rgb(0.1, 0.3, 0.8); // Blue color for headings

  // Helper function to check if we need a new page
  const checkPageSpace = (requiredSpace: number) => {
    if (y - requiredSpace < margin) {
      page = pdfDoc.addPage(pageSize);
      y = pageHeight - margin;
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

  // Draw heading with 12pt font and blue color
  const drawHeading = (text: string) => {
    checkPageSpace(lineHeight * 2);
    y -= lineHeight; // Space before heading

    // Draw heading text
    page.drawText(text.toUpperCase(), {
      x: margin,
      y,
      font: timesRomanBold,
      size: 12, // Changed to 12pt
      color: headingColor
    });

    y -= lineHeight; // Space after heading
  };

  // Draw bullet point
  const drawBulletPoint = (text: string) => {
    checkPageSpace(lineHeight);
    y -= lineHeight;
    page.drawText("•", { x: margin, y, font: timesRoman, size: fontSize });
    page.drawText(text, { x: margin + 15, y, font: timesRoman, size: fontSize });
  };

  // Draw date on the right side
  const drawRightAlignedText = (text: string, yPos: number) => {
    const textWidth = timesRoman.widthOfTextAtSize(text, 10);
    page.drawText(text, {
      x: pageWidth - margin - textWidth,
      y: yPos,
      font: timesRoman,
      size: 10,
      color: rgb(0.5, 0.5, 0.5)
    });
  };

  // Helper function to format dates
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });

  // --- HEADER ---
  // Only draw header if full_name exists
  if (user.profiles && user.profiles.full_name) {
    // Name in uppercase, centered with blue color
    const nameWidth = timesRomanBold.widthOfTextAtSize(user.profiles.full_name.toUpperCase(), 24);
    page.drawText(user.profiles.full_name.toUpperCase(), {
      x: (pageWidth - nameWidth) / 2,
      y,
      font: timesRomanBold,
      size: 24, // Reduced from 36 to 24
      color: headingColor // Added blue color
    });
    y -= lineHeight * 2;

    // --- CONTACT INFORMATION ---
    // Only draw contact info if there are any contact items
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

      // Calculate column positions
      const columnWidth = (pageWidth - margin * 2) / contactGroups.length;
      let currentX = margin;

      // Draw each contact group
      contactGroups.forEach(group => {
        // Draw group title
        const titleWidth = timesRomanBold.widthOfTextAtSize(group.title, 10);
        page.drawText(group.title, {
          x: currentX + (columnWidth - titleWidth) / 2,
          y,
          font: timesRomanBold,
          size: 10,
          color: rgb(0.4, 0.4, 0.4)
        });
        y -= lineHeight;

        // Draw contact items
        group.items.forEach(item => {
          const labelWidth = timesRomanBold.widthOfTextAtSize(item.label + ":", 10);
          page.drawText(item.label + ":", {
            x: currentX,
            y,
            font: timesRomanBold,
            size: 10
          });

          page.drawText(item.value, {
            x: currentX + labelWidth + 5,
            y,
            font: timesRoman,
            size: 10
          });
          y -= lineHeight;
        });

        // Move to next column
        currentX += columnWidth;
        y = pageHeight - margin - lineHeight * 2; // Reset y for next column
      });

      y = pageHeight - margin - lineHeight * 5; // Reset y after contact section
    }
  }

  // --- CAREER OBJECTIVES ---
  if (user.career_objectives && user.career_objectives.length > 0) {
    const hasObjectives = user.career_objectives.some(obj => obj.career_objective);
    if (hasObjectives) {
      drawHeading("Career Objectives");
      user.career_objectives.forEach((obj) => {
        if (obj.career_objective) {
          drawBulletPoint(obj.career_objective);
        }
      });
      y -= lineHeight / 2; // Space after section
    }
  }

  // --- PROFILE SUMMARY ---
  if (user.personal_details && user.personal_details.profile_summary) {
    drawHeading("Profile Summary");
    drawParagraph(user.personal_details.profile_summary);
    y -= lineHeight / 2; // Space after section
  }

  // --- WORK EXPERIENCE ---
  if (user.work_experiences && user.work_experiences.length > 0) {
    drawHeading("Experience");
    y -= lineHeight / 2; // Extra space before items

    user.work_experiences.forEach((exp) => {
      // Save current position for date
      const dateY = y;

      // Draw job title and company - reduced font sizes
      if (exp.job_title) {
        drawParagraph(exp.job_title, pageWidth - margin * 2, timesRomanBold, 12); // Changed from 14 to 12
      }
      if (exp.company && exp.location) {
        drawParagraph(`${exp.company}, ${exp.location}`, pageWidth - margin * 2, timesRoman, 11); // Changed from 12 to 11
      }

      // Draw responsibilities
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach((resp) => {
          if (resp.value) {
            drawBulletPoint(resp.value);
          }
        });
      }

      // Go back to draw date on the right
      const dateText = `${formatDate(exp.start_date)} — ${formatDate(exp.end_date)}`;
      drawRightAlignedText(dateText, dateY);

      y -= lineHeight / 2; // Space between entries
    });

    y -= lineHeight / 2; // Space after section
  }

  // --- EDUCATION ---
  if (user.educations && user.educations.length > 0) {
    drawHeading("Education");
    y -= lineHeight / 2; // Extra space before items

    user.educations.forEach((edu) => {
      // Save current position for date
      const dateY = y;

      // Draw degree and institution - reduced font sizes
      if (edu.degree) {
        drawParagraph(edu.degree, pageWidth - margin * 2, timesRomanBold, 12); // Changed from 14 to 12
      }
      if (edu.institution && edu.location) {
        drawParagraph(`${edu.institution}, ${edu.location}`, pageWidth - margin * 2, timesRoman, 11); // Changed from 12 to 11
      }
      if (edu.grade) {
        drawParagraph(`Grade: ${edu.grade}`, pageWidth - margin * 2, timesRoman, 10);
      }

      // Go back to draw date on the right
      const dateText = `${formatDate(edu.start_date)} — ${formatDate(edu.end_date)}`;
      drawRightAlignedText(dateText, dateY);

      y -= lineHeight / 2; // Space between entries
    });

    y -= lineHeight / 2; // Space after section
  }

  // --- PROJECTS ---
  if (user.projects && user.projects.length > 0) {
    drawHeading("Projects");
    y -= lineHeight / 2; // Extra space before items

    user.projects.forEach((project) => {
      if (project.title) {
        drawParagraph(project.title, pageWidth - margin * 2, timesRomanBold, 12); // Changed from 14 to 12
      }
      if (project.description) {
        drawParagraph(project.description);
      }

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        const techText = project.technologies.map(t => t.value).join(", ");
        drawParagraph(`Technologies: ${techText}`, pageWidth - margin * 2, timesRoman, 10);
      }

      // Project link
      if (project.link) {
        drawParagraph(`Project Link: ${project.link}`, pageWidth - margin * 2, timesRoman, 10);
      }

      y -= lineHeight / 2; // Space between entries
    });

    y -= lineHeight / 2; // Space after section
  }

  // --- SKILLS ---
  if (user.skill_sets && user.skill_sets.length > 0) {
    const skills = user.skill_sets[0];
    const hasTechnicalSkills = skills.technical_skills && skills.technical_skills.length > 0;
    const hasSoftSkills = skills.soft_skills && skills.soft_skills.length > 0;

    if (hasTechnicalSkills || hasSoftSkills) {
      drawHeading("Skills");

      // Technical skills
      if (hasTechnicalSkills) {
        drawParagraph("Technical Skills:", pageWidth - margin * 2, timesRomanBold, 11); // Changed from 12 to 11
        const techText = skills.technical_skills.map(s => s.value).join(", ");
        drawParagraph(techText);
      }

      // Soft skills
      if (hasSoftSkills) {
        drawParagraph("Soft Skills:", pageWidth - margin * 2, timesRomanBold, 11); // Changed from 12 to 11
        const softText = skills.soft_skills.map(s => s.value).join(", ");
        drawParagraph(softText);
      }

      y -= lineHeight / 2; // Space after section
    }
  }

  // --- LANGUAGES ---
  if (user.languages && user.languages.length > 0) {
    const hasLanguages = user.languages.some(lang => lang.language && lang.proficiency);
    if (hasLanguages) {
      drawHeading("Languages");

      user.languages.forEach((lang) => {
        if (lang.language && lang.proficiency) {
          drawParagraph(`${lang.language}: ${lang.proficiency}`);
        }
      });

      y -= lineHeight / 2; // Space after section
    }
  }

  // --- CERTIFICATIONS ---
  if (user.profiles && user.profiles.certificates && user.profiles.certificates.length > 0) {
    drawHeading("Certifications");

    user.profiles.certificates.forEach((cert) => {
      if (cert.name) {
        drawParagraph(cert.name, pageWidth - margin * 2, timesRomanBold, 11); // Changed from 12 to 11
      }
      if (cert.issuer && cert.date) {
        drawParagraph(`${cert.issuer} · ${formatDate(cert.date)}`, pageWidth - margin * 2, timesRoman, 10);
      }
      y -= lineHeight / 4; // Small space between entries
    });

    y -= lineHeight / 2; // Space after section
  }

  // --- REFERENCES ---
  if (user.references && user.references.length > 0) {
    drawHeading("References");

    user.references.forEach((ref) => {
      if (ref.name) {
        drawParagraph(ref.name, pageWidth - margin * 2, timesRomanBold, 11); // Changed from 12 to 11
      }
      if (ref.position) {
        drawParagraph(ref.position, pageWidth - margin * 2, timesRoman, 11);
      }
      if (ref.email || ref.phone) {
        drawParagraph(`${ref.email || ''} ${ref.email && ref.phone ? '·' : ''} ${ref.phone || ''}`, pageWidth - margin * 2, timesRoman, 10);
      }
      y -= lineHeight / 4; // Small space between entries
    });
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  saveAs(blob, `${user.profiles?.full_name || "CV"}_MinimalistCV.pdf`);

}