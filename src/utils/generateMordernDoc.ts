import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import type { User } from "../types/cv/cv";

export async function generateModernDoc(user: User, type: string) {
  if (type !== "PDF") {
    alert("Only PDF is currently supported for Modern CV.");
    return;
  }
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const margin = 50;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const columnGap = 20;
  const leftColumnWidth = 360;
  const rightColumnWidth = pageWidth - margin * 2 - leftColumnWidth - columnGap;

  // Track current pages for each column
  let leftPage = page;
  let rightPage = page;
  let yLeft = pageHeight - margin;
  let yRight = pageHeight - margin;

  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSize = 12;
  const lineHeight = fontSize * 1.5;
  const headingColor = rgb(0.1, 0.3, 0.8); // Blue color for headings

  // Helper function to draw text on a specific page
  const drawText = (text: string, x: number, y: number, font = timesRoman, size = fontSize, color = rgb(0, 0, 0), targetPage = page) => {
    if (!text) return;
    targetPage.drawText(text, { x, y, font, size, color });
  };

  // Helper to check if we need a new page for left column
  const checkLeftPageSpace = (requiredSpace: number) => {
    if (yLeft - requiredSpace < margin) {
      leftPage = pdfDoc.addPage([595, 842]);
      yLeft = leftPage.getHeight() - margin;
      return true;
    }
    return false;
  };

  // Helper to check if we need a new page for right column
  const checkRightPageSpace = (requiredSpace: number) => {
    if (yRight - requiredSpace < margin) {
      rightPage = pdfDoc.addPage([595, 842]);
      yRight = rightPage.getHeight() - margin;
      return true;
    }
    return false;
  };

  const addSectionLeft = (title: string, marginTop = lineHeight) => {
    const requiredSpace = marginTop + lineHeight;
    checkLeftPageSpace(requiredSpace);

    yLeft -= marginTop;
    drawText(title.toUpperCase(), margin, yLeft, timesRomanBold, fontSize + 2, headingColor, leftPage);
    yLeft -= lineHeight / 2;
  };

  const addSectionRight = (title: string, marginTop = lineHeight) => {
    const requiredSpace = marginTop + lineHeight;
    checkRightPageSpace(requiredSpace);

    yRight -= marginTop;
    drawText(title.toUpperCase(), margin + leftColumnWidth + columnGap, yRight, timesRomanBold, fontSize + 2, headingColor, rightPage);
    yRight -= lineHeight / 2;
  };

  const addParagraphLeft = (text: string) => {
    if (!text) return;

    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      const width = timesRoman.widthOfTextAtSize(testLine, fontSize);

      if (width > leftColumnWidth) {
        checkLeftPageSpace(lineHeight);
        drawText(line, margin, yLeft, timesRoman, fontSize, rgb(0, 0, 0), leftPage);
        yLeft -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      checkLeftPageSpace(lineHeight);
      drawText(line, margin, yLeft, timesRoman, fontSize, rgb(0, 0, 0), leftPage);
      yLeft -= lineHeight;
    }
  };

  const addParagraphRight = (text: string) => {
    if (!text) return;

    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      const width = timesRoman.widthOfTextAtSize(testLine, fontSize);

      if (width > rightColumnWidth) {
        checkRightPageSpace(lineHeight);
        drawText(line, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize, rgb(0, 0, 0), rightPage);
        yRight -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      checkRightPageSpace(lineHeight);
      drawText(line, margin + leftColumnWidth + columnGap, yRight, timesRoman, fontSize, rgb(0, 0, 0), rightPage);
      yRight -= lineHeight;
    }
  };

  // --- Header ---
  if (user.profiles && user.profiles.full_name) {
    drawText(user.profiles.full_name.toUpperCase(), margin, yLeft, timesRomanBold, 16, headingColor, leftPage);
    yLeft -= lineHeight * 1.5;

    // Career objectives if available
    if (user.career_objectives && user.career_objectives.length > 0 && user.career_objectives[0].career_objective) {
      addParagraphLeft(user.career_objectives[0].career_objective);
    }

    // Contact information - only include non-empty fields
    if (user.profiles.email) {
      addParagraphLeft(`Email: ${user.profiles.email}`);
    }
    if (user.personal_details && user.personal_details.phone) {
      addParagraphLeft(`Phone: ${user.personal_details.phone}`);
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

  // --- Left Column: Main ---
  if (user.personal_details && user.personal_details.profile_summary) {
    addSectionLeft("Professional Summary");
    yLeft -= lineHeight * 1.0;
    addParagraphLeft(user.personal_details.profile_summary);
  }

  if (user.work_experiences && user.work_experiences.length > 0) {
    addSectionLeft("Work Experience");
    yLeft -= lineHeight * 1.0;

    user.work_experiences.forEach(exp => {
      if (exp.job_title && exp.company && exp.location) {
        addParagraphLeft(`${exp.job_title} | ${exp.company}, ${exp.location}`);
      }
      if (exp.start_date && exp.end_date) {
        addParagraphLeft(`${exp.start_date} - ${exp.end_date}`);
      }

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach(r => {
          if (r.value) {
            addParagraphLeft(`• ${r.value}`);
          }
        });
      }

      yLeft -= lineHeight / 2;
    });
  }

  if (user.projects && user.projects.length > 0) {
    addSectionLeft("Projects");
    yLeft -= lineHeight * 1.0;

    user.projects.forEach(proj => {
      if (proj.title) {
        addParagraphLeft(proj.title);
      }
      if (proj.description) {
        addParagraphLeft(proj.description);
      }

      if (proj.link) {
        addParagraphLeft(`Link: ${proj.link}`);
      }

      if (proj.technologies && proj.technologies.length > 0) {
        addParagraphLeft(`Technologies: ${proj.technologies.map(t => t.value).join(", ")}`);
      }

      yLeft -= lineHeight / 2;
    });
  }

  // --- Right Column: Sidebar ---
  if (user.educations && user.educations.length > 0) {
    addSectionRight("Education");
    yRight -= lineHeight * 1.0;

    user.educations.forEach(edu => {
      if (edu.degree && edu.institution && edu.location) {
        addParagraphRight(`${edu.degree} | ${edu.institution}, ${edu.location}`);
      }
      if (edu.start_date && edu.end_date && edu.grade) {
        addParagraphRight(`${edu.start_date} - ${edu.end_date} | Grade: ${edu.grade}`);
      }
      yRight -= lineHeight / 2;
    });
  }

  if (user.skill_sets && user.skill_sets.length > 0) {
    const skills = user.skill_sets[0];
    const hasTechnicalSkills = skills.technical_skills && skills.technical_skills.length > 0;
    const hasSoftSkills = skills.soft_skills && skills.soft_skills.length > 0;

    if (hasTechnicalSkills || hasSoftSkills) {
      addSectionRight("Skills");
      yRight -= lineHeight * 1.0;

      if (hasTechnicalSkills) {
        addParagraphRight(`Technical: ${skills.technical_skills.map(s => s.value).join(", ")}`);
      }
      if (hasSoftSkills) {
        addParagraphRight(`Soft: ${skills.soft_skills.map(s => s.value).join(", ")}`);
      }
    }
  }

  if (user.languages && user.languages.length > 0) {
    const hasLanguages = user.languages.some(lang => lang.language && lang.proficiency);

    if (hasLanguages) {
      addSectionRight("Languages");
      yRight -= lineHeight * 1.0;

      user.languages.forEach(l => {
        if (l.language && l.proficiency) {
          addParagraphRight(`${l.language} - ${l.proficiency}`);
        }
      });
    }
  }

  if (user.profiles && user.profiles.certificates && user.profiles.certificates.length > 0) {
    addSectionRight("Certificates");
    yRight -= lineHeight * 1.0;

    user.profiles.certificates.forEach(c => {
      if (c.name && c.issuer && c.date) {
        addParagraphRight(`${c.name} - ${c.issuer} (${c.date})`);
      }
    });
  }

  if (user.references && user.references.length > 0) {
    addSectionRight("References");
    yRight -= lineHeight * 1.0;

    user.references.forEach(r => {
      const refParts = [];
      if (r.name) refParts.push(r.name);
      if (r.position) refParts.push(r.position);
      if (r.email) refParts.push(r.email);
      if (r.phone) refParts.push(r.phone);

      if (refParts.length > 0) {
        addParagraphRight(refParts.join(" | "));
      }
    });
  }

  // --- Save PDF ---
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  saveAs(blob, `${user.profiles?.full_name || "CV"}_ModernCV.pdf`);

}