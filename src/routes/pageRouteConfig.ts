import { Home } from "../pages/Home";
import Help from "../pages/Help";
import Pricing from "../pages/Pricing";
import Documents from "../pages/Documents";
import CVTemplates from "../pages/CVTemplates";
import CreateDocs from "../pages/CreateDocs";
import CvDocument from "../pages/CvDocument";
import CVPage from "../pages/ProfileCVDetails";
import Dashboard from "../pages/Dashboard";
import CreateOfficialLetter from "../pages/CreateOfficialLetter";
// import JobPage from "../pages/JobPage";
import OfficialLetter from "../pages/OfficialLetter";
import { Verification } from "../components/sections/Verification";
// import CoverLetterDocument from "../pages/CoverLetterDocument";
// import PortfolioDocument from "../pages/PortfolioDocument";
// import CertificsateDocument from "../pages/CertificateDocument";
// import MyCoverLetter from "../pages/MyCoverLetter";
// import MyPortifolio from "../pages/MyPortifolio";
// import MyCertificate from "../pages/MyCertificate";
import AllDocuments from "../pages/AllDocuments";
import MyCv from "../pages/MyCv";
import CreateDocument from "../pages/CreateDocument";
import CVEditor from "../pages/CVEditor";
import PDFReports from "../pages/PDFReports";
export interface pageRouteConfig<P = {}> {
  forNav?: boolean;
  path: string;
  element: React.ComponentType<P>;
  private?: boolean;
  name: string;
  layout?: boolean;
  dropdown?: { name: string; path: string; active: boolean }[];
  showAsButton?: boolean;
}

export const routes: pageRouteConfig[] = [
  {
    forNav: true,
    path: "/",
    element: Home,
    name: "Home",
    layout: true,
  },
  {
    forNav: true,
    path: "/panel",   // 👈 fixed spelling
    element: Dashboard,
    name: "Panel",    // 👈 fixed spelling
    layout: true,
  }, 
  // {
  //   forNav: true,
  //   path: "/jobs",
  //   element: JobPage,
  //   name: "Jobs",
  //   layout: true,
  // }, 
  
  // {
  //   forNav: true,
  //   path: "/payments",
  //   element: PaymentComponent,
  //   name: "Payments",
  //   layout: true,

  // },
  {
    forNav: true,
    path: "/help",
    element: Help,
    name: "Help",
    layout: true,
  },
  {
    forNav: false,
    path: "/verify-email",
    element: Verification,
    name: "Verification",
    layout: true,
  },
  {
    forNav: true,
    path: "/documents",
    element: Documents,
    name: "Documents",
    layout: true,
    dropdown: [
      { name: "All Documents", path: "/documents", active: true },
      { name: "My CVs", path: "/documents/cvs", active: false },
      {
        name: "My Cover Letters",
        path: "/documents/cover-letters",
        active: false,
      },
      { name: "My Portfolios", path: "/documents/portfolios", active: false },
      {
        name: "My Certificates",
        path: "/documents/certificates",
        active: false,
      },
    ],
  },
  {
    forNav: true,
    path: "/documents/templates",
    element: CVTemplates,
    name: "Templates",
    layout: true,
    dropdown: [
      { name: "CV Templates", path: "/documents/templates/cv", active: true },
      { name: "Cover Letter Templates", path: "/documents/templates/cover-letter", active: false },
      { name: "Portfolio Templates", path: "/documents/templates/portfolio", active: false },
      { name: "Certificate Templates", path: "/documents/templates/certificate", active: false },
    ],
  },
  {
    forNav: false,
    path: "/documents/templates/cv",
    element: CVTemplates,
    name: "CV Templates",
    layout: true,
  },
  {
    forNav: true,
    path: "/create",
    element: CreateDocs,
    name: "Create",
    layout: true,
    dropdown: [
      { name: "CV", path: "/create/cv", active: true },
      { name: "Official Letter", path: "/create/official-letter", active: true },
      { name: "Pdf reports", path: "/create/pdf-reports", active: true },
      { name: "New Portfolio", path: "/create/portfolio", active: false },
      { name: "New Certificate", path: "/create/certificate", active: false },
    ],
  },

  {
    forNav: false,
    path: "/pricing",
    element: Pricing,
    name: "Pricing",
    layout: true,
  },
  {
    forNav: false,
    path: "/create/official-letter",
    element: CreateOfficialLetter,
    name: "Create Official Letter",
    layout: true,
  },
{
  forNav: false,
  path: "/create/pdf-reports",
  element: PDFReports, // now allowed
  name: "Create PDF Reports",
  layout: true,
},

  {
    forNav: false,
    path: "/official-letter",
    element: OfficialLetter,
    name: "Create Official Letter",
    layout: false,
  },


  {
    forNav: false,
    path: "/profile",
    element: CVPage,
    name: "Profile",
    layout: true,
    showAsButton: true, // ✅ Add this
  },
  {
    forNav: false,
    path: "/create/document",
    element: CreateDocument,
    name: "Create Document",
    layout: false,
  },
];

export const documentRoutes: pageRouteConfig[] = [
  {
    forNav: false,
    path: "/create/cv",
    element: CvDocument,
    name: "Create CV",
    layout: true,
  },
  {
    forNav: false,
    path: "/editor/:templateId", // 👈 dynamic template route
    element: CVEditor,
    name: "CV Editor",
    layout: true,
  },

  // {
  //     forNav: false,
  //     path: "/create/cover-letter",
  //     element: CoverLetterDocument,
  //     name: "Create Cover Letter",
  //     layout: false,
  // },
  // {
  //     forNav: false,
  //     path: "/create/portfolio",
  //     element: PortfolioDocument,
  //     name: "Create Portfolio",
  //     layout: false,
  // },
  // {
  //     forNav: false,
  //     path: "/create/certificate",
  //     element: CertificsateDocument,
  //     name: "Create Certificate",
  //     layout: false,
  // }
];

export const myDocumentsRoutes: pageRouteConfig[] = [
  {
    forNav: false,
    path: "/documents",
    element: AllDocuments,
    name: "All Documents",
    layout: true,
  },
  {
    forNav: false,
    path: "/documents/cvs",
    element: MyCv,
    name: "My CVs",
    layout: false,
  },
  // {
  //     forNav: false,
  //     path: "/documents/cover-letters",
  //     element: MyCoverLetter,
  //     name: "My Cover Letters",
  //     layout: false,
  // },
  // {
  //     forNav: false,
  //     path: "/documents/portfolios",
  //     element: MyPortifolio,
  //     name: "My Portfolios",
  //     layout: false,
  // },
  // {
  //     forNav: false,
  //     path: "/documents/certificates",
  //     element: MyCertificate,
  //     name: "My Certificates",
  //     layout: false,
  // }
];
