// src/utils/documentGenerators.ts
import { generateMinimalistDoc } from "./generateMinimalistDoc";
import { generateModernDoc } from "./generateMordernDoc"; // Updated file name
import { generateClassicDoc } from "./generateClassicDoc";
import type { User } from "../types/cv/cv";

/**
 * Central registry for CV generators.
 * Each generator receives (user, type) so they can support multiple output formats.
 * Currently all generators only handle PDF.
 */
export const documentGenerators: Record<string, (user: User, type: string) => void> = {
  "minimalist-cv": generateMinimalistDoc,
  "modern-cv": generateModernDoc,
  "finance-cv": generateClassicDoc,
};
