// src/api/endpoints.ts


export const AUTH_ENDPOINTS = {
  login: "auth/login/token/",
  register: "auth/signup/",
  verifyEmail: "auth/verify-email/",
  profile: "auth/profile/",
  logout: "auth/logout/",
  forgotPassword: "auth/forgot-password/",
  resetPassword: "auth/reset-password/",
  users: "auth/user-details/",
  admin: "auth/users/",
  googleAuth: "/auth/google-auth/",
};
export const PERSONAL_DETAILS_ENDPOINTS = {
  list: "api/personal-details/", // GET, POST
    detail: (id: number) => `api/personal-details/${id}/`, // GET, PUT, DELETE
};

export const WORK_EXPERIENCES_ENDPOINTS = {
  list: "api/work-experiences/", // GET, POST
  detail: (id: number) => `api/work-experiences/${id}/`, // GET, PUT, DELETE
};

export const CAREER_OBJECTIVE_ENDPOINTS = {
  list: "api/career-objective/", // GET, POST
  detail: (id: number) => `api/career-objective/${id}/`,
};

export const SKILLS_ENDPOINTS = {
  list: "api/skills/",
  detail: (id: number) => `api/skills/${id}/`,
};

export const EDUCATION_ENDPOINTS = {
  list: "api/education/",
  detail: (id: number) => `api/education/${id}/`,
};

export const LANGUAGES_ENDPOINTS = {
  list: "api/languages/", // GET, POST
  detail: (id: number) => `api/languages/${id}/`,
};

export const PROJECTS_ENDPOINTS = {
  list: "api/projects/",
  detail: (id: number) => `api/projects/${id}/`,
};

export const CERTIFICATES_ENDPOINTS = {
  list: "api/certificates/",
  detail: (id: number) => `api/certificates/${id}/`,
};

export const REFERENCES_ENDPOINTS = {
  list: "api/references/",
  detail: (id: number) => `api/references/${id}/`,
};

export const ACHIEVEMENTS_ENDPOINTS = {
  list: "api/achievements/",
  detail: (id: number) => `api/achievements/${id}/`,
};

export const ORDERS_ENDPOINTS = {
  export: "api/orders/export/",
  status: (order_id: string) => `api/orders/${order_id}/status/`,
  check: (cv_id: string) => `api/orders/${cv_id}/check/`,
};

export const PAYMENTS_ENDPOINTS = {
  initiate: "api/payments/initiate/",
  checkout: "api/payments/checkout/",
  azampayCallback: "api/payments/azampay/callback/",
  webhook: "api/payments/webhook/",
};

export const JOBS_ENDPOINTS = {
  list: "api/jobs/",
  detail: (id: number) => `api/jobs/${id}/`,
};

export const LETTERS_ENDPOINTS = {
  generate: "api/generate-letter/",
  list: "api/letters/",
  detail: (id: number) => `api/letters/${id}/`,
};

export const REPORT_ENDPOINTS = {
  generatePDF: "api/report/generate-pdf/",
};

export const SCHEMA_ENDPOINTS = {
  schema: "api/schema/",
};
export const TEMPLATE_DOWNLOAD: Record<string, string> = {
  Basic: "api/cv/download/basic/",
  Intermediate: "api/cv/download/intermediate/",
  Advanced: "api/cv/download/advanced/",
};