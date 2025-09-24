// src/data/sampleCV.ts

export const sampleCV = {
  personal_information: {
    full_name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+255712345678",
    address: "123 Main St, Dar es Salaam",
    linkedin: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe",
    website: "https://janedoe.dev",
    date_of_birth: "1995-06-15",
    nationality: "Tanzanian",
    profile_summary: "Software engineer with 5+ years of experience in full-stack web development.",
  },

  career_objective: {
    career_objective: "To secure a challenging position in a reputable organization to expand my learnings, knowledge, and skills.",
  },

  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Dar es Salaam",
      location: "Dar es Salaam, Tanzania",
      start_date: "2014-10",
      end_date: "2018-07",
      grade: "Upper Second Class",
    },
    {
      degree: "Master of Software Engineering",
      institution: "Arusha Institute of Technology",
      location: "Arusha, Tanzania",
      start_date: "2019-01",
      end_date: "2021-12",
      grade: "Distinction",
    },
  ],

  work_experience: [
    {
      experiences: [
        {
          job_title: "Frontend Developer",
          company: "Tech Innovations Ltd.",
          location: "Dar es Salaam",
          start_date: "2019-01",
          end_date: "2021-06",
          responsibilities: [
            { value: "Developed and maintained company website using React." },
            { value: "Collaborated with designers and backend developers." },
          ],
        },
        {
          job_title: "Full Stack Developer",
          company: "GlobalCode Ltd.",
          location: "Arusha",
          start_date: "2021-07",
          end_date: "Present",
          responsibilities: [
            { value: "Built REST APIs with Django and Node.js." },
            { value: "Integrated frontend and backend systems." },
          ],
        },
      ],
    },
  ],

  skills: {
    technicalSkills: [
      { value: "JavaScript" },
      { value: "React" },
      { value: "TypeScript" },
      { value: "Django" },
      { value: "Node.js" },
      { value: "PostgreSQL" },
    ],
    softSkills: [
      { value: "Teamwork" },
      { value: "Communication" },
      { value: "Problem-solving" },
      { value: "Adaptability" },
    ],
  },

  languages: [
    {
      languages: [
        { language: "English", proficiency: "Fluent" },
        { language: "Swahili", proficiency: "Native" },
        { language: "French", proficiency: "Basic" },
      ],
    },
  ],

  certifications: [
    {
      certificates: [
        {
          name: "AWS Certified Developer",
          issuer: "Amazon",
          date: "2022-03",
        },
        {
          name: "Google UX Design",
          issuer: "Coursera",
          date: "2021-09",
        },
        {
          name: "Scrum Master Certified (SMC)",
          issuer: "Scrum Alliance",
          date: "2023-01",
        },
      ],
    },
  ],

  projects: [
    {
      projects: [
        {
          title: "Portfolio Website",
          description: "A personal website to showcase projects and blogs.",
          link: "https://janedoe.dev",
          technologies: [{ value: "React" }, { value: "Tailwind CSS" }],
        },
        {
          title: "Inventory Management System",
          description: "A system to track stock, purchases, and sales.",
          link: "https://github.com/janedoe/inventory",
          technologies: [{ value: "Django" }, { value: "PostgreSQL" }],
        },
        {
          title: "Chat App",
          description: "Real-time chat app using websockets.",
          link: "https://github.com/janedoe/chat-app",
          technologies: [{ value: "Node.js" }, { value: "Socket.io" }],
        },
      ],
    },
  ],

  achievements: [
    "Won 1st place at Hackathon Dar 2021",
    "Published an article on React performance tips on Medium",
    "Mentored 10+ junior developers",
  ],

  references: [
    {
      references: [
        {
          name: "John Smith",
          position: "Senior Developer",
          email: "john.smith@example.com",
          phone: "+255713456789",
        },
        {
          name: "Alice Johnson",
          position: "Project Manager",
          email: "alice.johnson@example.com",
          phone: "+255714567890",
        },
      ],
    },
  ],
};
