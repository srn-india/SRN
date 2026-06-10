# Sashakt Rashtra Nirman (SRN) Full-Stack Platform

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)

Welcome to the official technical repository of **Sashakt Rashtra Nirman (SRN)**. This is an enterprise-grade, full-stack application designed to optimize NGO operations, facilitate community engagement, and manage complex social impact initiatives via a highly scalable architecture.

---

## 1.0 Architectural Overview

The repository is structured as a **pnpm workspace**, consolidating the entire SRN service ecosystem into a cohesive, deterministic monorepo powered by automated CI/CD pipelines.

### 1.1 [Frontend Client Subsystem](./artifacts/srn-website)
A highly interactive, client-side rendered Single-Page Application (SPA) designed for donors, volunteers, and administrative personnel.
- **Framework Specification**: React.js bundled via Vite.
- **Routing Engine**: React Router DOM.
- **Styling Architecture**: Tailwind CSS augmented by Framer Motion.
- **State Management & Data Synchronization**: React Context API & TanStack Query.
- **Application Telemetry**: Sentry (`@sentry/react`) utilizing strict Error Boundaries.
- **Deployment Strategy**: Vercel Edge Network (configured via `vercel.json`).

### 1.2 [Backend API Gateway](./artifacts/srn-backend)
A production-hardened, secure API service orchestrating core business logic and state mutations.
- **Runtime Environment**: Node.js utilizing the Express.js framework.
- **Database Layer**: PostgreSQL hosted via Supabase.
- **Object-Relational Mapping (ORM)**: Prisma.
- **Security Protocols**: JWT Access/Refresh tokens, Google OAuth 2.0, & Redis-backed token blocklisting.
- **Application Telemetry**: Sentry Node SDK incorporating CPU Profiling capabilities.
- **Deployment Strategy**: Render Platform orchestrated via multi-stage Docker containerization.

### 1.3 [Engineering Documentation](./progress)
Comprehensive technical progress reports, architectural specifications, and database schemas are maintained within the `/progress` and `/SRN_Project_Documents` directories.

---

## 2.0 Implementation Environment & Quick Start

Execute the following procedures to provision the workspace for local development.

### 2.1 System Prerequisites
- **Node.js**: v22.x or higher (LTS release recommended).
- **Package Manager**: pnpm (install via `npm install -g pnpm`).
- **Containerization**: Docker (Required for provisioning isolated PostgreSQL and Redis caching services).

### 2.2 Dependency Resolution
Resolve and link all workspace dependencies from the root directory:
```bash
pnpm install
```

### 2.3 Environment Variable Configuration
Provision local `.env` files within both subsystem directories.
- **Backend API**: Duplicate the template provided in `artifacts/srn-backend/.env`.
- **Frontend Client**: Duplicate the template provided in `artifacts/srn-website/.env`.
*(Notice: Verify that `SENTRY_DSN` and `VITE_SENTRY_DSN` are accurately populated to ensure local telemetry capture).*

### 2.4 Service Initialization

#### Bootstrapping the Backend Subsystem:
```bash
cd artifacts/srn-backend
npx prisma generate
npm run dev
```

#### Bootstrapping the Frontend Subsystem:
```bash
cd artifacts/srn-website
pnpm run dev
```

---

## 3.0 Core Technical Specifications

| System Module | Engineering Implementation |
| :--- | :--- |
| **Authentication Service** | Multi-provider architecture (Google + Credentials) featuring secure JWT rotation and OTP issuance. |
| **Membership & Asset Generation** | Dynamic, server-side `canvas` rendering to export verifiable cryptographic ID cards integrated with QR codes. |
| **Event Orchestration** | Bilingual (English/Hindi) scheduling interface leveraging context-driven localization models. |
| **Transaction Gateway** | Razorpay API integration processing membership capitalization and event ticketing. |
| **Global Observability** | Full-stack Sentry integration capturing unhandled exceptions and Core Web Vitals (CWV). |

---

## 4.0 Quality Assurance & Continuous Integration

The codebase enforces strict quality standards through comprehensive automated testing and continuous integration pipelines powered by **GitHub Actions** (`main.yml`).

- **Backend Validation (Jest)**: Execute `npm test` within `artifacts/srn-backend` (Currently maintaining 37 passing assertions validating RBAC, Authentication, and Profile mutation).
- **Frontend Validation (Vitest)**: Execute `pnpm test` within `artifacts/srn-website` (Currently maintaining 15 passing assertions utilizing the React Testing Library paradigm).
- **Automated Deployment Pipeline**: Commit propagation to the `main` branch automatically provisions isolated Dockerized PostgreSQL/Redis services, executes all 52 combined tests, compiles the production Docker image, and executes a push directly to the Docker Hub registry.

---

## 5.0 Licensing & Proprietary Notice
This software repository is proprietary. All intellectual property and distribution rights are reserved strictly by Sashakt Rashtra Nirman (SRN). Unauthorized copying, distribution, or modification is prohibited.
