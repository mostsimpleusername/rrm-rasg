# Rumah Amal Salman Garut (RRM-RASG) - Volunteer & Event Management System

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=RRM-RASG+Dashboard)

RRM-RASG is a modern, responsive web application designed to manage volunteers (members) and organizational events across multiple divisions. Built with performance and granular security in mind, the platform provides a unified dashboard for system administrators, division leads, and general members.

## 🌟 Key Features

- **Advanced Role-Based Access Control (RBAC)**
  - **Super Admins**: Total oversight. Can manage all users, transfer members between divisions, and oversee all events.
  - **Division Admins**: Granular access restricted exclusively to their assigned division. They can approve/reject members and create/cancel events strictly within their operational boundary.
  - **Members**: Can view available events, join them, and view their personal attendance dashboard.
- **Dynamic Event Status Automation**
  - Event statuses (`Upcoming`, `Ongoing`, `Completed`) are calculated in real-time based on the current date and time, eliminating manual overhead.
- **AI-Powered Event Generation**
  - Integrated with **Google Gemini AI** to automatically generate engaging, professional event descriptions based on a title and division context.
- **Bulletproof Database Security**
  - Uses PostgreSQL **Row Level Security (RLS)** ensuring that API boundaries cannot be bypassed. A division admin physically cannot update a row belonging to another division.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Charts & Data**: Recharts
- **Backend & Database**: Supabase (PostgreSQL, GoTrue Auth)
- **AI Integration**: `@google/genai` (Gemini)

## 📁 Project Structure & Documentation

This repository contains academic documentation for System Analysis classes located in the `/.apsi-laporan` directory:
- [01. Product Requirements Document (PRD)](.apsi-laporan/all-prd.md)
- [02. UML Diagrams (Use Case)](.apsi-laporan/uml.md)
- [03. User Flows & Sequence Diagrams](.apsi-laporan/userflow.md)
- [04. Activity Diagrams](.apsi-laporan/activity-dia.md)
- [05. Database Architecture & ERD](.apsi-laporan/erd.md)
- [06. Tech Stack & Security Infrastructure](.apsi-laporan/infrastructure.md)
- [07. Data Flow Diagrams (DFD)](.apsi-laporan/dfd.md)

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- A [Supabase](https://supabase.com/) Project
- A [Google Gemini API Key](https://aistudio.google.com/)

### 2. Environment Setup
Clone the repository and create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

*(Note for Vercel Deployments: Ensure these exact variable names are added to your Vercel Project Settings, including the `VITE_` prefix, otherwise the build will fail).*

### 3. Database Setup
1. Open your Supabase SQL Editor.
2. Copy the contents of `supabase/schema.sql` and run it to construct tables, enums, triggers, and Row Level Security policies.
3. Copy the contents of `supabase/seed.sql` and run it to automatically inject the demo users (`admin@org.com`, `wit@org.com`, `fufu@org.com`) with fully encrypted passwords and pre-configured profiles.

### 4. Run the Application
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`. 
You can log in with `admin@org.com` and password `password123`.

---
*Built for Rumah Amal Salman Garut.*