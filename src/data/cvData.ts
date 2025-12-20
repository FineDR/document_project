import type { User } from "../types/cv/cv";
import passport from "../assets/golo.png"
export const cvData: User = {
  id: 104,
  email: "emily.chen@example.com",
  first_name: "Emily",
  middle_name: "Grace",
  last_name: "Chen",
  is_staff: false,
  is_active: true,
  is_superuser: false,
  role: "user",
  soft_skills: ["problem solving", "critical thinking", "team collaboration"],
  technical_skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
  career_objectives: [
    {
      id: 310,
      career_objective: "Seeking a full-stack developer position to create innovative web applications that solve real-world problems.",
      created_at: "2023-01-10T09:15:00Z",
      updated_at: "2023-05-15T14:30:00Z",
      user: 104
    },
    {
      id: 311,
      career_objective: "Aim to lead development teams in building scalable and user-friendly software solutions.",
      created_at: "2023-02-05T11:20:00Z",
      updated_at: "2023-06-10T10:45:00Z",
      user: 104
    },
    {
      id: 312,
      career_objective: "Looking for opportunities to apply full-stack development skills in fintech innovation.",
      created_at: "2023-03-15T13:40:00Z",
      updated_at: "2023-07-20T15:25:00Z",
      user: 104
    }
  ],
  personal_details: {
    id: 204,
    first_name: "Emily",
    middle_name: "Grace",
    last_name: "Chen",
    email: "emily.chen@example.com",
    phone: "+1 (555) 369-2580",
    address: "321 Tech Street, Boston, MA",
    linkedin: "linkedin.com/in/emilychen",
    github: "github.com/emilyc",
    website: "emilychen.dev",
    date_of_birth: "1992-05-18",
    nationality: "Chinese-American",
    profile_summary: "Full-stack developer with 6+ years experience building web applications and leading development teams.",
    profile_image: passport,
    user: 104
  },
  profile: {
    id: 404,
    full_name: "Emily Grace Chen",
    email: "emily.chen@example.com",
    certificates: [
      {
        id: 510,
        name: "AWS Certified Developer Associate",
        issuer: "Amazon Web Services",
        date: "2022-04-10",
        profile: 404
      },
      {
        id: 511,
        name: "MongoDB Certified Developer",
        issuer: "MongoDB University",
        date: "2021-08-15",
        profile: 404
      },
      {
        id: 512,
        name: "React Developer Certification",
        issuer: "Meta",
        date: "2020-12-05",
        profile: 404
      }
    ]
  },
  educations: [
    {
      id: 610,
      degree: "Master of Science in Computer Science",
      institution: "Massachusetts Institute of Technology",
      location: "Cambridge, MA",
      start_date: "2014-09-01",
      end_date: "2016-05-20",
      grade: "Distinction",
      user: 104
    },
    {
      id: 611,
      degree: "Bachelor of Science in Software Engineering",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      start_date: "2010-09-01",
      end_date: "2014-06-10",
      grade: "Magna Cum Laude",
      user: 104
    },
    {
      id: 612,
      degree: "Full-Stack Web Development Certificate",
      institution: "App Academy",
      location: "San Francisco, CA",
      start_date: "2016-06-15",
      end_date: "2016-09-20",
      grade: "Top 10%",
      user: 104
    }
  ],
  languages: [
    {
      id: 710,
      language: "English",
      proficiency: "Native",
      created_at: "2023-01-15T08:45:00Z",
      updated_at: "2023-01-15T08:45:00Z",
      user: 104
    },
    {
      id: 711,
      language: "Mandarin",
      proficiency: "Professional",
      created_at: "2023-01-20T10:30:00Z",
      updated_at: "2023-02-25T13:15:00Z",
      user: 104
    },
    {
      id: 712,
      language: "Spanish",
      proficiency: "Intermediate",
      created_at: "2023-02-10T09:20:00Z",
      updated_at: "2023-03-15T11:40:00Z",
      user: 104
    }
  ],
  skill_sets: [
    {
      id: 810,
      soft_skills: [
        { id: 928, value: "Project Management", skill_set: 810 },
        { id: 929, value: "Team Leadership", skill_set: 810 },
        { id: 930, value: "Problem Solving", skill_set: 810 }
      ],
      technical_skills: [
        { id: 1028, value: "JavaScript", skill_set: 810 },
        { id: 1029, value: "React", skill_set: 810 },
        { id: 1030, value: "Node.js", skill_set: 810 }
      ],
      full_name: "Emily Grace Chen",
      email: "emily.chen@example.com",
      user: 104
    },
    {
      id: 811,
      soft_skills: [
        { id: 931, value: "Communication", skill_set: 811 },
        { id: 932, value: "Mentoring", skill_set: 811 },
        { id: 933, value: "Agile Methodologies", skill_set: 811 }
      ],
      technical_skills: [
        { id: 1031, value: "Python", skill_set: 811 },
        { id: 1032, value: "Django", skill_set: 811 },
        { id: 1033, value: "REST APIs", skill_set: 811 }
      ],
      full_name: "Emily Grace Chen",
      email: "emily.chen@example.com",
      user: 104
    },
    {
      id: 812,
      soft_skills: [
        { id: 934, value: "Critical Thinking", skill_set: 812 },
        { id: 935, value: "Time Management", skill_set: 812 },
        { id: 936, value: "Adaptability", skill_set: 812 }
      ],
      technical_skills: [
        { id: 1034, value: "AWS", skill_set: 812 },
        { id: 1035, value: "Docker", skill_set: 812 },
        { id: 1036, value: "MongoDB", skill_set: 812 }
      ],
      full_name: "Emily Grace Chen",
      email: "emily.chen@example.com",
      user: 104
    }
  ],
  projects: [
    {
      id: 1110,
      technologies: [
        { id: 1228, value: "React", project: 1110 },
        { id: 1229, value: "Node.js", project: 1110 },
        { id: 1230, value: "MongoDB", project: 1110 }
      ],
      title: "E-Learning Platform",
      description: "Built a comprehensive online learning platform with video streaming and interactive quizzes.",
      link: "https://github.com/emilyc/e-learning-platform",
      created_at: "2022-06-15T10:30:00Z",
      updated_at: "2022-11-20T14:45:00Z",
      user: 104
    },
    {
      id: 1111,
      technologies: [
        { id: 1231, value: "Python", project: 1111 },
        { id: 1232, value: "Django", project: 1111 },
        { id: 1233, value: "PostgreSQL", project: 1111 }
      ],
      title: "Inventory Management System",
      description: "Developed a real-time inventory tracking system with automated reporting features.",
      link: "https://github.com/emilyc/inventory-system",
      created_at: "2021-09-20T11:15:00Z",
      updated_at: "2022-02-15T16:30:00Z",
      user: 104
    },
    {
      id: 1112,
      technologies: [
        { id: 1234, value: "React Native", project: 1112 },
        { id: 1235, value: "Firebase", project: 1112 },
        { id: 1236, value: "Redux", project: 1112 }
      ],
      title: "Fitness Tracking App",
      description: "Created a mobile application for tracking workouts and nutrition with social features.",
      link: "https://github.com/emilyc/fitness-tracker",
      created_at: "2020-12-10T09:45:00Z",
      updated_at: "2021-05-15T13:20:00Z",
      user: 104
    }
  ],
  work_experiences: [
    {
      id: 1310,
      responsibilities: [
        { id: 1428, value: "Led development of web applications", work_experience: 1310 },
        { id: 1429, value: "Mentored junior developers", work_experience: 1310 },
        { id: 1430, value: "Improved application performance by 40%", work_experience: 1310 }
      ],
      job_title: "Senior Full-Stack Developer",
      company: "TechSolutions Inc.",
      location: "Boston, MA",
      start_date: "2019-03-01",
      end_date: "2023-01-10",
      user: 104
    },
    {
      id: 1311,
      responsibilities: [
        { id: 1431, value: "Developed RESTful APIs", work_experience: 1311 },
        { id: 1432, value: "Implemented responsive UI designs", work_experience: 1311 },
        { id: 1433, value: "Collaborated with product teams", work_experience: 1311 }
      ],
      job_title: "Full-Stack Developer",
      company: "Digital Innovations",
      location: "Cambridge, MA",
      start_date: "2016-10-15",
      end_date: "2019-02-28",
      user: 104
    },
    {
      id: 1312,
      responsibilities: [
        { id: 1434, value: "Built front-end components", work_experience: 1312 },
        { id: 1435, value: "Assisted with database design", work_experience: 1312 },
        { id: 1436, value: "Participated in code reviews", work_experience: 1312 }
      ],
      job_title: "Junior Web Developer",
      company: "WebCraft Studios",
      location: "San Francisco, CA",
      start_date: "2014-07-10",
      end_date: "2016-10-14",
      user: 104
    }
  ],
  references: [
    {
      id: 1510,
      name: "Dr. James Wilson",
      position: "Professor of Computer Science",
      email: "j.wilson@mit.edu",
      phone: "+1 (617) 555-0123",
      user: 104
    },
    {
      id: 1511,
      name: "Sarah Johnson",
      position: "CTO at TechSolutions",
      email: "s.johnson@techsolutions.com",
      phone: "+1 (617) 555-0456",
      user: 104
    },
    {
      id: 1512,
      name: "Michael Brown",
      position: "Lead Developer at Digital Innovations",
      email: "m.brown@digitalinnovations.com",
      phone: "+1 (617) 555-0789",
      user: 104
    }
  ],
  achievement_profile: {
    full_name: "Emily Grace Chen",
    email: "emily.chen@example.com",
    achievements: [
      {
        id: 1610,
        value: "Best Web Application Award 2022",
        profile: 404
      },
      {
        id: 1611,
        value: "TechSolutions Innovation Award 2021",
        profile: 404
      },
      {
        id: 1612,
        value: "Top 30 Developers Under 30 2020",
        profile: 404
      }
    ]
  }
};