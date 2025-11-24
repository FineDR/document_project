// src/utils/aiPromptBuilderDynamic.ts
import { cvValidationSchema } from "../components/forms/cvValidationSchema";

type SectionKey = keyof typeof cvValidationSchema;

interface UserDataAny {
  [key: string]: any;
}

/**
 * Build an AI prompt dynamically for any CV section
 * based on schema and available user data.
 */
export const buildAIPromptDynamic = (section: SectionKey, userData: UserDataAny): string => {
  const schema = cvValidationSchema[section];
  
  // 1. Check if User provided specific instruction text (from the Modal)
  // We expect the key 'instruction_text' to be passed in userData when using the Modal flow
  if (userData && userData.instruction_text) {
    const fieldNames = schema && schema.shape ? Object.keys(schema.shape).join(", ") : "relevant CV fields";
    
    return `
      You are an expert CV Data Extractor.
      I will provide you with raw text. Your task is to extract information suitable for the "${section}" section of a CV.
      
      Please extract the following fields if available: ${fieldNames}.
      
      The output MUST be a valid JSON object where keys match the fields mentioned above. 
      If a field is not found in the text, set its value to an empty string "".
      Do NOT return markdown, just the JSON.

      Here is the text to analyze:
      "${userData.instruction_text}"
    `;
  }

  // 2. Default Logic (Enhancing existing data)
  const sectionData = userData[section] ?? {};
  let basePrompt = `Generate professional CV content for the section: "${section}".`;

  // Iterate over keys in the schema to get field names
  if (schema && typeof sectionData === "object") {
    const fields = Object.keys(sectionData);
    if (fields.length > 0) {
      basePrompt += ` Include the following details: `;
      const fieldDescriptions = fields
        .map((key) => {
          const val = sectionData[key];
          if (Array.isArray(val)) {
            // Handle arrays like skills, experiences, projects
            return `${key}: ${JSON.stringify(val)}`;
          }
          return `${key}: ${val ?? "N/A"}`;
        })
        .join("; ");
      basePrompt += fieldDescriptions;
    }
  }

  basePrompt += ` Keep the content concise, professional, and CV-ready.`;

  return basePrompt;
};