import pptxgen from "pptxgenjs";

const pptx = new pptxgen();

// Set presentation properties
pptx.layout = "LAYOUT_16x9";
pptx.title = "Real Estate CRM & Channel Partner Management System";
pptx.author = "M.Sc. Project";

// Standard styling options - Simple, clean, no theme, no graphics
const FONT_TITLE = "Calibri";
const FONT_BODY = "Calibri";
const COLOR_TITLE = "000000";
const COLOR_BODY = "333333";
const COLOR_MUTED = "666666";

// Helper function to add a standard slide with title and body
function createSlide(titleText) {
  const slide = pptx.addSlide();
  
  // Title box
  slide.addText(titleText, {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.8,
    fontSize: 22,
    fontFace: FONT_TITLE,
    bold: true,
    color: COLOR_TITLE,
    valign: "top"
  });

  return slide;
}

// -----------------------------------------------------------------------------
// SLIDE 1: Title Slide
// -----------------------------------------------------------------------------
const slide1 = pptx.addSlide();
slide1.addText("Real Estate CRM & Channel Partner Management System", {
  x: 1.0,
  y: 1.8,
  w: 11.3,
  h: 1.5,
  fontSize: 32,
  fontFace: FONT_TITLE,
  bold: true,
  color: COLOR_TITLE,
  align: "left",
  valign: "middle"
});

slide1.addText("An End-to-End Enterprise Solution for Lead Tracking, CP Onboarding, and Sales Workflow Automation", {
  x: 1.0,
  y: 3.4,
  w: 11.3,
  h: 0.8,
  fontSize: 18,
  fontFace: FONT_BODY,
  color: COLOR_MUTED,
  align: "left",
  valign: "top"
});

slide1.addText("• Master of Science (M.Sc.) Final Project Presentation\n• Tech Stack: React.js | Node.js | Express.js | MongoDB", {
  x: 1.0,
  y: 4.6,
  w: 11.3,
  h: 1.0,
  fontSize: 15,
  fontFace: FONT_BODY,
  color: COLOR_BODY,
  align: "left",
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 2: 1.6 Project Profile
// -----------------------------------------------------------------------------
const slide2 = createSlide("1.6 Project Profile");
slide2.addText([
  { text: "Project Title:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Real Estate Customer Relationship Management (CRM) & Channel Partner (CP) Automation System\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Academic Context / Target Domain:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Master of Science (M.Sc.) in Computer Science / Information Technology\n• Tailored for Real Estate Developers, Mandate Brokers, and Channel Partner Networks\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Project Duration & Type:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Duration: 4 to 6 Months (Planning, Requirement Analysis, Prototyping, Development, and Testing)\n• Type: Full-Stack Web Application (Enterprise SaaS / B2B & B2C CRM Portal)\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Target Users:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• System Administrators, Sales & Operational Managers, Sales Agents, and Channel Partners", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 3: 1.7 Problem Statement
// -----------------------------------------------------------------------------
const slide3 = createSlide("1.7 Problem Statement");
slide3.addText([
  { text: "Core Problem Definition:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "The real estate industry relies heavily on manual, fragmented communication (spreadsheets, chat apps, and paper logs), causing high response delays, lead leakage, and lack of accountability.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Key Operational Bottlenecks:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "1. Lead Leakage & Inadequate Follow-Up Tracking: Inability to track lead priority (Warm/Hot/Cold) leads to lost conversions.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "2. Unregulated Channel Partner Onboarding: Lack of structured verification for RERA licenses, PAN, and GST documents.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "3. Absence of Audit Trails & Interaction History: Managers cannot view complete customer contact timelines and agent remarks.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "4. Tedious Manual Data Entry: Ingesting hundreds of leads from Meta/Google ad campaigns manually causes duplication and errors.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "5. Lack of Role-Based Governance: Unsegregated data creates privacy risks and operational confusion.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 4: 1.8 Objectives & Scope of the Project
// -----------------------------------------------------------------------------
const slide4 = createSlide("1.8 Objectives & Scope of the Project");
slide4.addText([
  { text: "Primary Project Objectives:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Centralized Lead Pipeline: Track leads across stages (RNR, Follow-up, Site Visit, Revisit, Booking).\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Digital CP Lifecycle: Automate registration, document verification (RERA/PAN), and credential dispatch.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Role-Based Access Control (RBAC): Dedicated interfaces for Admin, Manager, Agent, and CP.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Bulk Data Ingestion: Fast CSV/Excel bulk lead import with data validation.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Real-Time Actionable Analytics: Daily follow-up queues, attention lists, and conversion metrics.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Scope of the Project:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• In Scope: Lead lifecycle management, multi-city project mapping, JWT security, automated email alerts via Nodemailer, responsive web UI.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Out of Scope (Future Scope): In-browser VoIP telephony dialer, direct payment gateway integration.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 5: 1.9 SDLC Methodology
// -----------------------------------------------------------------------------
const slide5 = createSlide("1.9 SDLC Methodology (Agile Scrum)");
slide5.addText([
  { text: "Methodology Adopted: Agile Scrum Framework\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "Agile was chosen to support iterative development, frequent testing, and rapid adaptation to role-based workflows.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Sprint Breakdown:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Sprint 1 - Planning & Architecture: Database schema design (MongoDB), project architecture setup.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Sprint 2 - Authentication & RBAC: JWT authentication, Bcrypt password hashing, admin CLI setup.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Sprint 3 - Core Lead & Project Modules: Project CRUD, lead pipeline stages, and timeline audit logs.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Sprint 4 - CP Verification & Bulk Ingestion: Document uploads (Multer), automated email dispatch, CSV parser.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Sprint 5 - Frontend Integration & UI: React 19 single-page app, dashboards, and charts.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "• Sprint 6 - Testing & Deployment: End-to-end integration testing, bug fixes, and documentation.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 6: 2.1 Existing System / Limitations
// -----------------------------------------------------------------------------
const slide6 = createSlide("2.1 Existing System / Limitations");
slide6.addText([
  { text: "Overview of the Existing System:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "Currently, sales teams use shared spreadsheets (Excel/Google Sheets), manual phone logs, and informal messaging groups to handle leads and broker partnerships.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Major System Limitations:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "1. Data Redundancy & Overwrite Conflicts: Simultaneous edits in spreadsheets cause lost or corrupted lead data.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "2. Zero Activity Tracking & Accountability: No persistent history of past agent conversations, notes, or follow-up attempts.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "3. Delayed Lead Response Times: Leads generated online remain unattended due to manual distribution.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "4. Compliance Risks with Channel Partners: Inability to systematically verify RERA and tax registration certificates.\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "5. Poor Scalability: Spreadsheets fail to manage high lead volumes across multiple regional offices.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 7: 2.2 Proposed Solution
// -----------------------------------------------------------------------------
const slide7 = createSlide("2.2 Proposed Solution");
slide7.addText([
  { text: "How the Proposed System Overcomes Existing Limitations:\n\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "1. Unified Centralized Database: Single source of truth powered by MongoDB ensures data integrity and zero duplication.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "2. Real-Time Interaction Timeline: Automated timestamped logging of remarks and stage changes for every lead.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "3. Automated Lead Distribution & Follow-Up Reminders: Instant assignment to agents and dedicated 'Today's Follow-up' alerts.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "4. Digital Channel Partner Verification: Secure document upload, verification workflow, and automated login credential generation.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "5. High-Speed Bulk Lead Parsing: Import hundreds of leads from CSV files in seconds with automated data validation.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 8: 2.3 Feasibility Study
// -----------------------------------------------------------------------------
const slide8 = createSlide("2.3 Feasibility Study");
slide8.addText([
  { text: "1. Technical Feasibility:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Developed using the proven MERN stack (MongoDB, Express.js, React 19, Node.js).\n• Cross-platform compatibility across modern web browsers without special client hardware.\n• Highly modular architecture supporting smooth scaling and feature additions.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "2. Operational Feasibility:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Intuitive, responsive UI designed with Bootstrap 5 and Lucide icons requires minimal staff training.\n• Directly aligns with established real estate workflows (inquiry -> site visit -> booking).\n• Reduces administrative overhead for sales managers by over 60%.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "3. Economic Feasibility:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Utilizes 100% open-source software libraries, eliminating costly recurring licensing fees.\n• Low hosting requirements on scalable cloud infrastructure.\n• High ROI through improved lead conversion rates and reduced broker onboarding cycle times.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 9: 2.4.1 Functional Requirements (User Stories)
// -----------------------------------------------------------------------------
const slide9 = createSlide("2.4.1 Functional Requirements (User Stories)");
slide9.addText([
  { text: "System Administrator & Manager Stories:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• \"As an Admin, I can create and manage user accounts with specific roles (Admin, Manager, Agent) and assign them to projects.\"\n• \"As a Manager, I can review Channel Partner applications, verify RERA/PAN documents, and send login credentials via email.\"\n• \"As an Admin/Manager, I can bulk import leads via CSV files and monitor overall stage conversion metrics.\"\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "Sales Agent Stories:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• \"As an Agent, I can view my assigned leads, filter by project, and prioritize by status (Warm/Hot/Cold).\"\n• \"As an Agent, I can access my 'Today's Follow-up' queue to never miss client meetings or calls.\"\n• \"As an Agent, I can update lead stages (RNR, Follow-up, Site Visit, Booking) and add timestamped remarks.\"\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "Channel Partner Stories:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• \"As a Channel Partner, I can submit an online registration with company details, RERA license, and tax documents.\"", options: { fontSize: 13.5, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 10: 2.4.2 Non-Functional Requirements
// -----------------------------------------------------------------------------
const slide10 = createSlide("2.4.2 Non-Functional Requirements");
slide10.addText([
  { text: "1. Performance Requirements:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Client-side load times under 2 seconds leveraging Vite bundling and lightweight React components.\n• Backend REST API response times under 200ms using optimized MongoDB indexing.\n• Non-blocking asynchronous bulk CSV upload processing.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "2. Security & Compliance Requirements:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Industry-standard password encryption using Bcrypt (10 salt rounds).\n• Stateless session management with JSON Web Tokens (JWT) and secure HTTP headers.\n• Strict input sanitization and email validation using validator middleware.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "3. Scalability & Reliability Requirements:\n", options: { bold: true, fontSize: 16, color: COLOR_TITLE } },
  { text: "• Modular MVC (Model-View-Controller) structure supporting seamless horizontal backend scaling.\n• Fault-tolerant error handling on both client and server with user-friendly toast notifications.\n• Document-based schema accommodating multi-region and multi-project growth.", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 11: 3.1 System Architecture
// -----------------------------------------------------------------------------
const slide11 = createSlide("3.1 System Architecture (3-Tier Enterprise Architecture)");
slide11.addText([
  { text: "Tier 1: Presentation Tier (Client):\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• Single Page Application (SPA) built with React 19, React Router v7, and Bootstrap 5.\n• Role-specific dashboards for Admin, Manager, Agent, and Channel Partner.\n• Communicates with backend services asynchronously via Axios REST calls.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Tier 2: Application Tier (Business Logic Server):\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• Node.js & Express.js REST API server handling request routing and business logic.\n• Security layer: JWT authentication middleware and Bcrypt password encryption.\n• Service layer: Multer document handler, CSV parser, and Nodemailer email engine.\n\n", options: { fontSize: 14, color: COLOR_BODY } },
  { text: "Tier 3: Data & Storage Tier (Database):\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• MongoDB NoSQL Database managed via Mongoose ODM.\n• Core Collections: Users, Leads, Projects, and ChannelPartners.\n• Secure local/cloud storage for uploaded partner verification documents (PAN, RERA, GST).", options: { fontSize: 14, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 12: 3.2 Technology Stack
// -----------------------------------------------------------------------------
const slide12 = createSlide("3.2 Technology Stack");
slide12.addText([
  { text: "3.2.1 Frontend Technologies:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• React 19 (Component-based UI), Vite (Build tool), React Router v7 (Client routing)\n• Bootstrap 5 & React-Bootstrap (Responsive styling), Recharts (Data visualization)\n• Lucide Icons & FontAwesome (UI icons), React-Toastify & SweetAlert2 (Notifications)\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "3.2.2 Backend Technologies:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• Node.js (Runtime environment), Express.js (REST API framework)\n• JSON Web Tokens (JWT) (Authentication), Bcrypt (Password hashing)\n• Multer (File uploads), Nodemailer (Email service), PapaParse / CSV-Parser (Bulk data)\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "3.2.3 Database Tier:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• MongoDB (NoSQL Document database), Mongoose ODM (Data modeling & validation)\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "3.2.4 Development & Testing Tools:\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "• VS Code (IDE), Postman (API testing), Git & GitHub (Version control), Nodemon (Live reload)", options: { fontSize: 13.5, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// -----------------------------------------------------------------------------
// SLIDE 13: 3.3 Justification of Technology
// -----------------------------------------------------------------------------
const slide13 = createSlide("3.3 Justification of Technology Stack");
slide13.addText([
  { text: "Why Choose the MERN Stack over Traditional Stacks (PHP/MySQL, Java Spring, Django)?\n\n", options: { bold: true, fontSize: 15, color: COLOR_TITLE } },
  { text: "1. Unified JavaScript Ecosystem:\n", options: { bold: true, fontSize: 14, color: COLOR_TITLE } },
  { text: "• Using JavaScript across both Frontend (React) and Backend (Node.js) eliminates context switching and speeds up development cycles.\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "2. Dynamic Schema Flexibility (MongoDB):\n", options: { bold: true, fontSize: 14, color: COLOR_TITLE } },
  { text: "• Real estate leads have evolving parameters and nested activity timelines (`lead.timeline`) that fit naturally into MongoDB documents without complex SQL joins.\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "3. High Concurrency & Asynchronous Performance (Node.js):\n", options: { bold: true, fontSize: 14, color: COLOR_TITLE } },
  { text: "• Non-blocking event-driven architecture handles high volumes of concurrent API requests and bulk CSV uploads effortlessly.\n\n", options: { fontSize: 13.5, color: COLOR_BODY } },
  { text: "4. Responsive Single-Page Application (React 19):\n", options: { bold: true, fontSize: 14, color: COLOR_TITLE } },
  { text: "• Virtual DOM enables instant client-side filtering, stage updates, and real-time dashboard refresh without page reloading.", options: { fontSize: 13.5, color: COLOR_BODY } }
], {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 5.5,
  fontFace: FONT_BODY,
  valign: "top"
});

// Save presentation
pptx.writeFile({ fileName: "presentation.pptx" }).then((fileName) => {
  console.log(`Presentation created successfully: ${fileName}`);
}).catch((err) => {
  console.error("Error creating presentation:", err);
});
