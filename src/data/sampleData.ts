import { type User } from '../types/cv/cv';

export const sampleCVData: User = {
  id: 11,
  career_objectives: [
    {
      id: 1,
      career_objective: "wedgjggkjlhk",
      created_at: "2025-08-13T21:58:11.539992Z",
      updated_at: "2025-08-13T21:58:11.540007Z",
      user: 11
    }
  ],
  personal_details: {
    id: 2,
    phone: "0692671206",
    address: "dodoma",
     first_name: "John",
    middle_name: "M",
    last_name: "Doe",
    email: "john.doe@example.com",
    linkedin: "http://192.168.1.1/login.html?_t=9367062",
    github: "http://192.168.1.1/login.html?_t=9367062",
    website: "http://192.168.1.1/login.html?_t=9367062",
    date_of_birth: "2025-08-15",
    nationality: "20000811301130000125",
    profile_summary: "To make the content of the panel (main section) fit properly within the available space (without overflowing vertically), you need to adjust the layout so that: The full layout doesn't exceed the screen height (h-screen) unnecessarily. The content section is scrollable when it overflows. You remove redundant h-screen on inner containers.",
    user: 11
  },
  profile: {
    id: 1,
    certificates: [
      { id: 1, name: "asfsgsgdf", issuer: "fgjfhk", date: "2025-08-22", profile: 1 },
      { id: 2, name: "qasfgd", issuer: "sgfhdgg", date: "2025-08-21", profile: 1 }
    ],
    full_name: "Finesawa M Lekwa",
    email: "jefoy56487@bizmud.com",
  },
  educations: [
    { id: 1, degree: "Bachelor of Science", institution: "University of Example", location: "Dar es Salaam", start_date: "2018-09-01", end_date: "2022-06-30", grade: "Upper Second Class", user: 11 },
    { id: 2, degree: "dfgh", institution: "ghjk", location: "ghjk", start_date: "2025-08-01", end_date: "2025-08-15", grade: "Upper Second Class", user: 11 }
  ],
  languages: [
    { id: 2, language: "swahili", proficiency: "Beginner", created_at: "2025-08-13T22:51:26.193640Z", updated_at: "2025-08-13T22:51:26.193649Z", user: 11 },
    { id: 3, language: "English", proficiency: "Fluent", created_at: "2025-08-13T22:51:26.197281Z", updated_at: "2025-08-13T22:51:26.197305Z", user: 11 }
  ],
  skill_sets: [
    {
      id: 1,
      soft_skills: [
        { id: 1, value: "communication", skill_set: 1 },
        { id: 2, value: "skeaching", skill_set: 1 },
        { id: 3, value: "english", skill_set: 1 }
      ],
      technical_skills: [
        { id: 1, value: "node js", skill_set: 1 },
        { id: 2, value: "react js", skill_set: 1 },
        { id: 3, value: "java", skill_set: 1 }
      ],
      full_name: "Finesawa M Lekwa",
      email: "jefoy56487@bizmud.com",
      user: 11
    }
  ],
  projects: [
    { id: 3, technologies: [{ id: 1, value: "react", project: 3 }, { id: 2, value: "node js", project: 3 }], title: "wqreteryty", description: "ttrtr", link: "http://192.168.1.1/login.html", created_at: "2025-08-13T23:14:29.754160Z", updated_at: "2025-08-13T23:14:29.754179Z", user: 11 },
    { id: 4, technologies: [{ id: 3, value: "spring boot", project: 4 }], title: "dsfgh", description: "dgfhjk", link: "http://192.168.1.1/login.html", created_at: "2025-08-13T23:14:29.766168Z", updated_at: "2025-08-13T23:14:29.766175Z", user: 11 },
    { id: 5, technologies: [{ id: 4, value: "react", project: 5 }], title: "wqreteryty", description: "ttrtr", link: "http://192.168.1.1/login.html", created_at: "2025-08-14T11:52:09.364560Z", updated_at: "2025-08-14T11:52:09.364569Z", user: 11 }
  ],
  work_experiences: [
    { id: 2, responsibilities: [{ id: 1, value: "manager", work_experience: 2 }, { id: 2, value: "IT OFFICER", work_experience: 2 }], job_title: "wqet", company: "sdfgdh", location: "fdgghgj", start_date: "2025-08-05", end_date: "2025-08-16", user: 11 },
    { id: 3, responsibilities: [{ id: 3, value: "manager", work_experience: 3 }, { id: 4, value: "IT OFFICER", work_experience: 3 }], job_title: "wqet", company: "sdfgdh", location: "fdgghgj", start_date: "2025-08-13", end_date: "2025-08-22", user: 11 },
    { id: 4, responsibilities: [{ id: 5, value: "IT consultant", work_experience: 4 }, { id: 6, value: "IT manager", work_experience: 4 }], job_title: "wrteryrt", company: "dhfgjfhk", location: "dodoma", start_date: "2025-08-15", end_date: "2025-08-16", user: 11 }
  ],
  references: [
    { id: 2, name: "John Doe", position: "Manager", email: "john@example.com", phone: "1234567890", user: 11 },
    { id: 3, name: "tfryt", position: "fgfgh", email: "meme@gmail.com", phone: "2345657778909", user: 11 }
  ],

  // ✅ FIXED achievement_profile
  achievement_profile: {
    full_name: "Finesawa M Lekwa",
    email: "jefoy56487@bizmud.com",
    achievements: [
      { id: 1, value: "Graduated with honors", profile: 1 },
      { id: 2, value: "Developed a full-stack platform", profile: 1 },
      { id: 3, value: "Worked as an IT consultant", profile: 1 }
    ]
  },

  email: "jefoy56487@bizmud.com",
  first_name: "Finesawa",
  middle_name: "M",
  last_name: "Lekwa",
  soft_skills: undefined,
  technical_skills: undefined
};

export default sampleCVData;
