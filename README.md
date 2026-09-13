# 🏢 Fourcourse Properties | Real Estate CRM & Channel Partner Portal

A production-ready, full-stack Real Estate Customer Relationship Management (CRM) and Channel Partner (CP) management platform built with **React (Vite)**, **Node.js (Express)**, and **MongoDB**. Designed to streamline real-estate sales pipelines, multi-tier team collaboration, marketing channel analytics, and broker onboarding.

---

## 🌟 Key Highlights & Features

- 📊 **Interactive Analytics & Dashboards**:
  - **Admin Dashboard**: Marketing channel ingestion waves (AreaChart), acquisition share (Donut/PieChart), and end-to-end sales conversion funnels (BarChart).
  - **Manager Dashboard**: Daily lead ingestion trends with interactive month-by-month filtering and team pipeline conversion.
  - **Agent Dashboard**: Personal assigned pipeline breakdown and lead warmth priority matrix (`Hot`, `Warm`, `Cold`).
  - **Fluid Animations**: 100% reliable SVG entrance animations across all devices and page refreshes.
- 🤝 **Channel Partner Ecosystem**:
  - High-converting modern landing page (`/partner`) featuring interactive commission calculators, benefits, and broker testimonials.
  - Self-service broker registration portal (`/register-cp`) with RERA certificate, GST, and PAN document upload.
  - Multi-stage verification and approval workflow (Manager verification ➔ Admin approval).
- 🎯 **Complete Lead Lifecycle Management**:
  - 6-Stage progression: `RNR` ➔ `Follow-up` ➔ `Site Visit` ➔ `Site Visit Done` ➔ `Revisit` ➔ `Booking`.
  - Priority status tagging: `Hot`, `Warm`, `Cold`.
  - Today's follow-up reminders agenda with direct client calling and communication logs.
  - Bulk CSV lead import and export with automatic field mapping.
- 🏗️ **Project Catalog**:
  - Multi-city residential and commercial property management with dynamic lead counts and status control (`Active`, `Hold`, `Sold Out`).
- 🔐 **Role-Based Access Control (RBAC)**:
  - Secure JWT authentication with strict route protection for **Admin**, **Manager**, **Agent**, and **Channel Partner**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Recharts, Bootstrap 5, React-Bootstrap, Lucide Icons, React-Toastify |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB ODM), JWT (jsonwebtoken), Bcrypt.js, Multer |
| **Email & Communication** | Nodemailer (Automated onboarding alerts and registration emails) |
| **Database** | MongoDB (Local community server or MongoDB Atlas cloud cluster) |

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended)
- **[npm](https://www.npmjs.com/)** (comes pre-bundled with Node.js)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (MongoDB Community Server running locally on port `27017` or a MongoDB Atlas connection URI)
- **[Git](https://git-scm.com/)**

---

## ⚡ Quick Start Guide (Run in 3 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/sabugarsakir/crm.git
cd crm
```

---

### Step 2: Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```

   > Default `.env` values work out of the box with local MongoDB:
   > ```env
   > PORT=3000
   > MONGODB_URI=mongodb://127.0.0.1:27017/fcp_lead_soft
   > JWT_SECRET=your_jwt_secret_key
   > ALLOWEDORIGINS=http://localhost:5100
   > EMAIL_USER=your_email@gmail.com
   > EMAIL_PASS=your_app_password
   > ```

4. **Seed Realistic Demo Data (Recommended)**:
   Populate the database with 7 active real estate projects, 7 test accounts across all roles, 59 realistic buyer leads with historical timeline data, and today's follow-up schedule:
   ```bash
   node seedData.js
   ```

   *(Alternative: If you prefer creating a clean custom Super Admin from scratch, run `node createAdmin.js` instead).*

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   > 🟢 Backend will run at: **`http://localhost:3000`**

---

### Step 3: Frontend Setup

1. Open a **new terminal window** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```

   > The `.env` file should contain:
   > ```env
   > VITE_BACKEND_URL=http://localhost:3000
   > ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   > 🔵 Frontend will run at: **`http://localhost:5100`**

---

## 🔑 Pre-Configured Demo Accounts

After running `node seedData.js`, you can immediately log in at **`http://localhost:5100/login`** using any of these roles:

| Role | Email | Password | Access & Purpose |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `sakir@gmail.com` | `123456` | Full administrative access, project creation, agent/manager provisioning, executive analytics. |
| **👔 Sales Manager** | `sakirmanager@gmail.com` | `123456` | Team lead allocation, monthly sales trends, Channel Partner verification. |
| **👔 Senior Manager** | `sarmaji@gmail.com` | `123456` | Secondary manager profile for testing multi-manager collaboration. |
| **💼 Sales Agent** | `sakiragent@gmail.com` | `123456` | Personal pipeline stage breakdown, Hot/Warm leads priority, follow-up call agenda. |
| **💼 Senior Agent** | `priya.sharma@fourcourse.com`| `123456` | Assigned leads portfolio for testing individual agent performance. |
| **💼 Field Agent** | `vikram.singh@fourcourse.com` | `123456` | Field visit tracking and client remarks logging. |
| **🤝 Channel Partner**| `sam@gmail.com` | `123456` | External broker access to project catalogs and submitted client inquiries. |

---

## 📁 Repository Structure

```text
crm/
├── backend/
│   ├── config/             # Database connection & third-party configs
│   ├── controllers/        # Business logic for Leads, Users, Projects, CP
│   ├── middleware/         # Auth verification, JWT extraction & role validation
│   ├── models/             # Mongoose schemas (User, Lead, Project, ChannelPartner)
│   ├── routes/             # Express API endpoints
│   ├── uploads/            # Uploaded CP verification documents (PAN, GST, RERA)
│   ├── createAdmin.js      # Interactive CLI script for new admin creation
│   ├── seedData.js         # Realistic database population script
│   ├── server.js           # Server bootstrap & Express entry point
│   └── package.json
│
├── frontend/
│   ├── public/             # Static logos and assets
│   ├── src/
│   │   ├── assets/         # App graphics and branding
│   │   ├── components/     # Reusable Navbars, Sidebars, Modals & UI Widgets
│   │   ├── context/        # AppContext (Auth state, token, user profile)
│   │   ├── pages/
│   │   │   ├── admin/      # AdminDashboard, User Management, Approvals
│   │   │   ├── manager/    # ManagerDashboard, Team Pipeline, CP Verification
│   │   │   ├── agent/      # AgentDashboard, My Leads, Today's Follow-ups
│   │   │   ├── projects/   # CreateProject, EditProject, GetProjects, ManageLead
│   │   │   ├── ChannelPartnerLanding.jsx  # Modern public broker portal (/partner)
│   │   │   ├── RegisterCP.jsx             # Channel Partner registration form
│   │   │   └── Login.jsx                  # Unified role authentication page
│   │   ├── App.css         # Custom Corporate SaaS Design System
│   │   ├── App.jsx         # App routes & role-based route guards
│   │   └── main.jsx        # React root mount
│   ├── vite.config.js      # Vite dev server configuration (Port 5100)
│   └── package.json
│
└── README.md
```

---

## 🌐 Key Routes & Navigation

| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/login` | Public | Authentication page for Admin, Managers, Agents & Partners |
| `/partner` | Public | Landing page for external brokers & Channel Partners |
| `/register-cp` | Public | Channel Partner registration with file uploads |
| `/admin/dashboard` | Admin Only | Global business intelligence, lead sources, and conversion funnel |
| `/manager/dashboard` | Manager Only | Sales team monitoring, monthly ingestion trends |
| `/agent/dashboard` | Agent Only | Personal assigned pipeline, daily follow-ups agenda |
| `/get-projects` | Authenticated | Real estate project catalog with lead metrics |

---

## 🛠️ Common Troubleshooting

- **MongoDB Connection Error (`ECONNREFUSED 127.0.0.1:27017`)**:
  - Ensure your local MongoDB service is running (`mongod` or via Windows Services).
  - Alternatively, provide a remote MongoDB Atlas URI in `backend/.env`.
- **CORS Errors**:
  - Check that `ALLOWEDORIGINS=http://localhost:5100` in `backend/.env` matches your frontend Vite URL.
- **Port Conflicts**:
  - Backend runs on `3000`. If port 3000 is occupied, update `PORT` in `backend/.env` and `VITE_BACKEND_URL` in `frontend/.env`.
  - Frontend runs on `5100` (configured in `frontend/vite.config.js`).

---

## 📄 License & Attribution

Developed as an MSc Software Engineering project for real estate management and workflow automation. All trademarks and brand names belong to their respective owners.
