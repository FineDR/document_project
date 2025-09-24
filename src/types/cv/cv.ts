// CV Data Types
export interface User {
    id: number;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    is_staff?: boolean;       // true if user is staff/admin
    is_superuser?: boolean;   // true if user is superuser
    role?: "admin" | "user";  // optional role field
    career_objectives: CareerObjective[];
    personal_details: PersonalDetails;
    profiles: Profile;
    educations: Education[];
    languages: Language[];
    skill_sets: SkillSet[];
    projects: Project[];
    work_experiences: WorkExperience[];
    references: Reference[];
    achievement_profile: AchievementProfile;
  }
  
  export interface CareerObjective {
    id: number;
    career_objective: string;
    created_at: string;
    updated_at: string;
    user: number;
  }
  
  export interface PersonalDetails {
    id: number;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    website: string;
    date_of_birth: string;
    nationality: string;
    profile_summary: string;
    user: number;
  }
  
  export interface Profile {
    id: number;
    certificates: Certificate[];
    full_name: string;
    email: string;
    user: number;
  }
  
  export interface Certificate {
    id: number;
    name: string;
    issuer: string;
    date: string;
    profile: number;
  }
  
  export interface Education {
    id: number;
    degree: string;
    institution: string;
    location: string;
    start_date: string;
    end_date: string;
    grade: string;
    user: number;
  }
  
  export interface Language {
    id: number;
    language: string;
    proficiency: string;
    created_at: string;
    updated_at: string;
    user: number;
  }
  
  export interface SkillSet {
    id: number;
    soft_skills: Skill[];
    technical_skills: Skill[];
    full_name: string;
    email: string;
    user: number;
  }
  
  export interface Skill {
    id: number;
    value: string;
    skill_set?: number;
  }
  
  export interface Project {
    id: number;
    technologies: Technology[];
    title: string;
    description: string;
    link: string;
    created_at: string;
    updated_at: string;
    user: number;
  }
  
  export interface Technology {
    id: number;
    value: string;
    project: number;
  }
  
  export interface WorkExperience {
    id: number;
    responsibilities: Responsibility[];
    job_title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    user: number;
  }
  
  export interface Responsibility {
    id: number;
    value: string;
    work_experience: number;
  }
  
  export interface Reference {
    id: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    user: number;
  }
  
  // Template / Category Types
  export interface Template {
    id: string;
    name: string;
    description: string;
    image?: string; // optional if using component preview instead of PNG
    component: React.ComponentType<{ data: User }>; // must receive a User
  }
  
  export interface Category {
    id: string;
    name: string;
    templates: Template[];
  }
  export interface AchievementProfile {
    full_name: string;
    email: string;
    achievements: Achievement[];
  }
  
  export interface Achievement {
    id: number;
    value: string;
    profile: number;
  }