# CareerBridge Career Portal MVP

A full-stack career portal starter with Candidate, Recruiter, and Admin experiences.

## Included in this MVP

- Candidate / Recruiter registration and login
- JWT authentication with role-based access
- Public job listing, search, filters, and job details
- Candidate job applications and application status tracking
- Recruiter job posting, job closing, applicant list, and hiring status updates
- Admin portal stats and user list
- PostgreSQL database
- Responsive React UI
- Health endpoint: `GET /api/health`

## Stack

- Frontend: React 19.3 + Vite 8.x
- Backend: Java 21 + Spring Boot 4.1.1 + Spring Security + Spring Data JPA
- Database: PostgreSQL

## Local setup

### 1. Database
Create a PostgreSQL database:

```sql
CREATE DATABASE career_portal;
```

Default local credentials expected by the backend:
- database: `career_portal`
- username: `postgres`
- password: `postgres`

You can override all values with environment variables shown in `backend/.env.example`.

### 2. Backend

Install Java 21 and Maven, then:

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`.

Local admin account (development only):
- Email: `admin@careerportal.local`
- Password: `Admin@123`

Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` before production deployment.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Deployment variables

Backend:
- `DATABASE_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Frontend:
- `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`

## Next build phase

Recommended next additions:
- Resume upload/storage
- Candidate profile editor
- Company profile + recruiter verification
- Saved jobs
- Interview scheduling
- Email notifications
- Forgot/reset password
- Pagination and advanced filters
- Admin moderation controls
- Analytics charts
- Audit logs
