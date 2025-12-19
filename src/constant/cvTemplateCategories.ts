// src/constants/cvTemplateCategories.ts

export interface CVTemplateCategory {
  id: number;
  name: string;
  description: string;
  preview?: string; // optional thumbnail image URL
  
}

export const CV_TEMPLATE_CATEGORIES: CVTemplateCategory[] = [
  {
    id: 1,
    name: "Basic",
    description: "Simple, clean, text-focused CV suitable for fresh graduates or academic roles.",
  },
  {
    id: 2,
    name: "Intermediate",
    description: "Modern and professional CV with clean layout and subtle design elements.",
  },
  {
    id: 3,
    name: "Advanced",
    description: "Creative, visually appealing CV with colors, icons, or infographics, ideal for designers or creative roles.",
  },
    {
    id: 4,
    name: "Modern", // This name MUST match the key in templateMap below
    description: "Sleek split-layout with a dark sidebar. Ideal for tech and creative roles.",
  },
  {
  id: 5,
  name: "Minimalist", // Matches key below
  description: "A clean, top-heavy layout with a dedicated side column for skills.",
},
 {
    id: 6,
    name: "Creative", // This name MUST match the key in step 2
    description: "A bold, high-contrast design with a layered header for a strong first impression.",
  },
];
