# Rumah Amal Salman — Prototype

This repository contains a frontend prototype for a Human Resource & Event Management system. It's intentionally frontend-first: the UI, pages and flows are implemented with mock data and localStorage to validate UX and component design before building a production backend.

This README explains:
- System architecture and how the prototype maps to the production system
- Recommended tech stack for the real project
- Database schema (Prisma-ready summary)
- Planned API endpoints
- Local development and deployment notes
- Roadmap and next steps to move from prototype → production

---

## Goals

- Validate UI and user flows for authentication, member management, event management and admin dashboards.
- Provide reusable React components and visual patterns to accelerate the full project.
- Produce a clear migration plan: replace prototype data layer with an Express + Prisma backend and PostgreSQL.

## System Architecture (prototype → production)

- Frontend (prototype): React + Vite + Tailwind — presents UI, uses `DataContext` with mock data and localStorage for session simulation.
- Frontend (production): same UI stack — replace `DataContext` with an API client + auth store (Zustand or Context + secure token storage).
- Backend (production): Node.js + Express providing REST endpoints for auth, users, events, attendance. JWT + bcrypt for auth.
- Database (production): PostgreSQL managed with Prisma ORM and migrations.

Mapping prototype pieces to production code:
- `DataContext` → `client/services/api.ts` + token-based auth flows
- UI pages/components → reused with API-backed data
- Charts/visualizations → same components, fed by API metrics

## Tech Stack (recommended)

Frontend
- React 18 (Vite)
- Tailwind CSS + shadcn/ui (optional)
- React Router
- React Hook Form + Zod
- Axios for API calls
- Zustand for small global state (optional)

Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT authentication + bcrypt
- express-validator for request validation

Dev / Infra
- Git, GitHub
- Vercel for frontend, Railway/Render for backend
- Postman / Thunder Client for API testing

## Database Schema (summary, Prisma-ready)

Enums:
- Division: HR, Lingkungan, Media, Ristek, Kesehatan, Pendidikan
- Role: super_admin, division_admin, member
- UserStatus: active, inactive, pending
- EventStatus: upcoming, ongoing, completed, cancelled
- AttendanceStatus: registered, attended, absent

Models (summary):
- User: id (UUID), name, email, password (hashed in production), division, role, status, createdAt, updatedAt
- Event: id (UUID), name, description, eventDate, location, organizerDivision, status, maxParticipants, createdById, createdAt, updatedAt
- Attendance: id (UUID), eventId, userId, attendanceStatus, registeredAt, attendedAt

These models support role-based user management, event CRUD, attendance tracking and reporting.

## Planned API Endpoints

Auth
- POST /api/auth/register — register (status pending)
- POST /api/auth/login — returns JWT
- POST /api/auth/logout — client clears token
- GET /api/auth/me — current user

Users (admin-protected)
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id
- PATCH /api/users/:id/approve

Events
- GET /api/events
- GET /api/events/:id
- POST /api/events (admin)
- PUT /api/events/:id (admin)
- DELETE /api/events/:id (admin)
- PATCH /api/events/:id/status (admin)

Attendance
- POST /api/attendance/register
- DELETE /api/attendance/:id
- GET /api/attendance/my-events
- PATCH /api/attendance/:id/mark (admin)

Standard response format (recommended):
```json
{ "success": true|false, "message": "...", "data": {...} }
```

## Local development (prototype)

Install and run the UI prototype:

```powershell
npm install
npm run dev
```

Build:

```powershell
npm run build
npm run preview
```

Notes: the prototype uses mock data and localStorage. Migrating to real backend requires creating `client/services/api.ts` and replacing `DataContext` calls with API calls.

## Deployment notes

- Frontend: Vercel (build: `npm run build`, output: `dist`)
- Backend: Railway/Render with `DATABASE_URL` and env vars
- Database: Supabase/Neon/Postgres; run Prisma migrations on deploy

Vercel tips:
- Ensure `react` and `react-dom` versions match (this project targets React 18). Commit `package-lock.json` so Vercel installs the same versions you tested locally.

## Roadmap: prototype → production (high-level)

Phase 1 — Backend & Auth
- Scaffold `server/` with Express, Prisma and auth endpoints
- Setup `.env` and `DATABASE_URL`
- Implement JWT auth, password hashing, and middleware

Phase 2 — API integration
- Replace `DataContext` with API service layer
- Add token handling (HTTP-only cookie recommended) and protected routes
- Add forms with React Hook Form + Zod

Phase 3 — Admin & reporting
- Implement user approvals, event management, attendance marking and exports

Phase 4 — QA & deploy
- Add tests (unit + integration)
- Performance optimizations (code-splitting)
- Deploy and run migrations on production DB

## Security & best practices (summary)

- Hash passwords with bcrypt (salt rounds >= 10)
- Store secrets in env vars; configure platform secrets (Vercel/Railway)
- Use HTTPS in production and secure cookies for tokens
- Validate inputs both frontend (Zod) and backend (express-validator)
- Rate-limit critical endpoints

## How this prototype helps

This prototype provides:

- Reusable UI components and patterns to accelerate frontend work
- Page layout and UX decisions (navigation, modals, tables)
- Chart patterns for admin dashboards
- Seed design ideas for API endpoints and DB schema

Use the prototype as a visual & UX reference. The code will be refactored to call the backend services and to separate UI+data concerns.
