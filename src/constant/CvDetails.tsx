import type { CVData, Education, WorkExperience, Language, Skills, Certification, Project, Reference } from '../types/cv/types';

const sampleCV: CVData = {
  personal_information: {
    full_name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
    date_of_birth: '',
    nationality: '',
    profile_summary: ''
  },
  career_objective: '',
  education: [],
  work_experience: [],
  skills: {
    technical_skills: [],
    soft_skills: [],
    languages: []
  },
  certifications: [],
  projects: [],
  achievements: [],
  references: []
};

export default sampleCV;
export type { CVData, Education, WorkExperience, Language, Skills, Certification, Project, Reference };
