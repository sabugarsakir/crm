# Real Estate CRM & Channel Partner Management System

A full-stack web application built with **React (Vite)**, **Node.js (Express)**, and **MongoDB** for managing real estate leads, projects, sales teams, and channel partner onboarding.

---

## 📋 Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local MongoDB running on port 27017 or MongoDB Atlas URI)

---

## 🚀 How to Setup & Run

### 1. Backend Setup

Open a terminal and run:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file (.env)
# On Windows:
Copy-Item .env.example .env
# On Mac/Linux:
cp .env.example .env

# Create initial Super Admin user (Follow on-screen prompts)
node createAdmin.js

# Start backend server
npm run dev
```

> The backend server will start on: **`http://localhost:3000`**

---

### 2. Frontend Setup

Open a **new terminal window** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file (.env)
# On Windows:
Copy-Item .env.example .env
# On Mac/Linux:
cp .env.example .env

# Start frontend development server
npm run dev
```

> The frontend web app will open at: **`http://localhost:5173`**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/fcp_lead_soft
JWT_SECRET=your_jwt_secret_key
ALLOWEDORIGINS=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 👥 Default User Roles

1. **Admin**: Manage projects, create team members (Managers/Agents), import leads via CSV, approve Channel Partners.
2. **Manager**: Assign leads, track team performance, verify Channel Partners.
3. **Agent**: View assigned leads, update lead stages (RNR, Follow-up, Site Visit, Booking), add remarks.
4. **Channel Partner**: External broker registration (`/register-cp`) and document upload.

---

## 📤 How to Push to Git (GitHub / GitLab)

Open terminal in the root project folder:

```bash
# 1. Initialize git
git init

# 2. Add files
git add .

# 3. Commit files
git commit -m "Initial commit"

# 4. Set main branch
git branch -M main

# 5. Add your remote repository link
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to repository
git push -u origin main
```
