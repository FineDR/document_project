// types/CVTypes.ts
export interface PersonalInformation {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
    website?: string;
    date_of_birth?: string;
    nationality?: string;
    profile_summary?: string;
  }
  
  export interface Education {
    degree: string;
    institution: string;
    location: string;
    start_date: string;
    end_date: string;
    grade?: string;
  }
  
  export interface WorkExperience {
    job_title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    responsibilities: string[];
  }
  
  export interface Language {
    language: string;
    proficiency: string;
  }
  
  export interface Skills {
    technical_skills: string[];
    soft_skills: string[];
    languages: Language[];
  }
  
  export interface Certification {
    name: string;
    issuer: string;
    date: string;
  }
  
  export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }
  
  export interface Reference {
    name: string;
    position: string;
    email: string;
    phone: string;
  }
  
  export interface CVData {
    personal_information: PersonalInformation;
    career_objective: string;
    education: Education[];
    work_experience: WorkExperience[];
    skills: Skills;
    certifications: Certification[];
    projects: Project[];
    achievements: string[];
    references: Reference[];
  }
  export interface Letter {
  id: any;
  recipient: string;
  recipientTitle: string;
  recipientAddress: string;
  sender: string;
  senderTitle: string;
  senderAddress: string;
  date: string; // ISO date string
  subject: string;
  content: string;
  closing: string;
}