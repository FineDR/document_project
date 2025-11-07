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
  id: number | string;            // keep flexible for backend IDs
  recipient: string;              // recipientName
  recipientTitle: string;         // salutation or recipient's designation
  recipientAddress: string;       // organization + address + city
  sender: string;                 // senderName
  senderTitle: string;            // optional: sender designation
  senderAddress: string;           // city or office address
  date: string;                   // ISO date string
  subject: string;
  content: string;                // body of the letter
  closing: string;                // closingPhrase
  senderSignature?: string;       // typed or uploaded signature (base64)
  lang: "en" | "sw";              // language of the letter
  alignContact: "start" | "end";  // alignment for contact info (left/right)
}

export interface Achievement {
  id: number;
  value: string;
  profile: number;
}
