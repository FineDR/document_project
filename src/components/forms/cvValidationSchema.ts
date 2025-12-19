/* eslint-disable @typescript-eslint/no-explicit-any */


// src/components/forms/cvValidationSchema.ts
import { z } from "zod";

const urlOptional = z
  .string()
  .optional()
  .refine(
    (val) =>
      !val ||
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
        val
      ),
    { message: "Invalid URL" }
  );

export const personalInformationSchema = z.object({
  // Name fields
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),

  // Contact info
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),

  // URLs optional and validated if provided
  linkedin: urlOptional,
  github: urlOptional,
  website: urlOptional,

  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  profile_summary: z.string().optional(),

  profile_image: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 5_000_000,
      { message: "File size must be less than 5MB" }
    )
    .optional(),
});


export const careerObjectiveSchema = z.object({
  career_objective: z.string().min(1, "Career Objective is required"),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  grade: z.string().min(1, "Grade is required"),
});

export const workExperiencesSchema = z.object({
  experiences: z.array(
    z.object({
      job_title: z.string().min(1, "Job title is required"),
      company: z.string().min(1, "Company name is required"),
      location: z.string().optional(),
      start_date: z.string().min(1, "Start date is required"),
      end_date: z.string().optional(),
      responsibilities: z
        .array(z.object({ value: z.string().min(1, "Responsibility is required") }))
        .min(1, "At least one responsibility is required"),
    })
  ).min(1, "At least one work experience is required"),
});


export const skillsSchema = z.object({
  technicalSkills: z
    .array(
      z.object({
        value: z.string().min(1, "Technical skill cannot be empty"),
      })
    )
    .nonempty("At least one technical skill is required").optional(),
  softSkills: z
    .array(
      z.object({
        value: z.string().min(1, "Soft skill cannot be empty"),
      })
    )
    .nonempty("At least one soft skill is required").optional(),
});

export const languagesSchema = z.object({
  languages: z.array(
    z.object({
      language: z.string().min(1, "Language is required"),
      proficiency: z.string().min(1, "Proficiency is required"),
    })
  ).min(1, "At least one language is required"),
});

export const certificationsSchema = z.object({
  certificates: z.array(
    z.object({
      name: z.string().min(1),
      issuer: z.string().min(1),
      date: z.string().optional(),
    })
  ).min(1, "At least one certificate is required"),
});

export const projectSchema = z.object({
  projects: z.array(
    z.object({
      id: z.number().optional(),

      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),

      link: z
        .string()
        .url("Invalid link")
        .or(z.literal(""))
        .optional(),

      technologies: z
        .array(
          z.object({ value: z.string().optional() })
        )
        .min(1, "At least one technology required")

    })
  ),
});



export const achievementsSchema = z.object({
  achievement: z
    .array(
      z.object({
        value: z.string().min(1, "Achievement cannot be empty"),
      })
    )
    .nonempty("At least one achievement is required"),
});

export const singleReferenceSchema = z.object({
  name: z.string().min(1, "Referee name is required"),
  position: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export const referencesSchema = z.object({
  references: z.array(singleReferenceSchema).min(1, "At least one reference is required"),
});

// Map categories to schemas
export const cvValidationSchema: Record<string, any> = {
  personal_information: personalInformationSchema,
  career_objective: careerObjectiveSchema,
  education: z.array(educationSchema).nonempty("At least one education record is required"),
  work_experience: z.array(workExperiencesSchema).nonempty("At least one work experience is required"),
  skills: skillsSchema, // skills looks like an object with arrays inside, keep as is
  languages: z.array(languagesSchema).nonempty("At least one language is required"),
  certifications: z.array(certificationsSchema).nonempty("At least one certification is required"),
  projects: z.array(projectSchema).nonempty("At least one project is required"),
  achievements: z.array(z.string().min(1, "Achievement cannot be empty")).nonempty("At least one achievement is required"),
  references: z.array(referencesSchema).nonempty("At least one reference is required"),
};
export type CVValidationSchema = typeof cvValidationSchema;

export const risalaSchema = z.object({
  // STEP 1
 event_type: z.enum(["harusi", "msiba", "uzinduzi", "mgeni_rasmi"])
    .refine(val => !!val, { message: "Chagua aina ya tukio" }),
  event_title: z.string().min(1, "Jina la tukio ni lazima"),
  event_date: z.string().min(1, "Chagua tarehe ya tukio"),
  event_location: z.string().min(1, "Andika mahali pa tukio"),

  // STEP 2
  guest_of_honor: z.string().optional(),
  guest_title: z.string().optional(),
  organization_name: z.string().optional(),
  organization_representative: z.string().optional(),

  // STEP 3
  purpose_statement: z.string().min(1, "Andika lengo kuu la risala"),
  background_info: z.string().optional(),
  main_message: z.string().min(1, "Andika ujumbe mkuu"),

  // STEP 4 (conditional)
  bride_name: z.string().optional(),
  groom_name: z.string().optional(),
  wedding_theme: z.string().optional(),

  deceased_name: z.string().optional(),
  relationship: z.string().optional(),
  tribute_summary: z.string().optional(),

  project_name: z.string().optional(),
  project_goal: z.string().optional(),
  project_beneficiaries: z.string().optional(),

  program_name: z.string().optional(),
  program_theme: z.string().optional(),

  // STEP 5
  requests: z.string().optional(),
  closing_statement: z.string().optional(),
  presenter_name: z.string().min(1, "Andika jina la msomaji"),
  presenter_title: z.string().optional(),
});