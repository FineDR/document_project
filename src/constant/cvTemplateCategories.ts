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
];
