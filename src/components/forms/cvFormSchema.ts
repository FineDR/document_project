
export type Field = {
  name: string;
  label: string;
  type: string;
  isArray?: boolean;  // <-- make this optional
};

export const cvFormSchema: Record<string, Field[]> = {
  personal_information: [
    { name: 'full_name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn', type: 'url' },
    { name: 'github', label: 'GitHub', type: 'url' },
    { name: 'website', label: 'Website', type: 'url' },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { name: 'nationality', label: 'Nationality', type: 'text' },
    { name: 'profile_summary', label: 'Profile Summary', type: 'textarea' },
  ],
  career_objective: [
    { name: 'career_objective', label: 'Career Objective', type: 'textarea' },
  ],
  education: [
    { name: 'degree', label: 'Degree', type: 'text' },
    { name: 'institution', label: 'Institution', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'start_date', label: 'Start Date', type: 'month' },
    { name: 'end_date', label: 'End Date', type: 'month' },
    { name: 'grade', label: 'Grade', type: 'text' },
  ],
  work_experience: [
    { name: 'job_title', label: 'Job Title', type: 'text' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'start_date', label: 'Start Date', type: 'month' },
    { name: 'end_date', label: 'End Date', type: 'month' },
    { name: 'responsibilities', label: 'Responsibilities', type: 'textarea', isArray: true },
  ],
  skills: [
    { name: 'technical_skills', label: 'Technical Skills', type: 'text', isArray: true },
    { name: 'soft_skills', label: 'Soft Skills', type: 'text', isArray: true },
  ],
  languages: [
    { name: 'language', label: 'Language', type: 'text' },
    { name: 'proficiency', label: 'Proficiency', type: 'text' },
  ],
  certifications: [
    { name: 'name', label: 'Certification Name', type: 'text' },
    { name: 'issuer', label: 'Issuer', type: 'text' },
    { name: 'date', label: 'Date', type: 'month' },
  ],
  projects: [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'technologies', label: 'Technologies', type: 'text', isArray: true },
    { name: 'link', label: 'Project Link', type: 'url' },
  ],
  achievements: [
    { name: 'achievement', label: 'Achievement', type: 'text', isArray: true },
  ],
  references: [
    { name: 'name', label: 'Referee Name', type: 'text' },
    { name: 'position', label: 'Position', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
  ]
};