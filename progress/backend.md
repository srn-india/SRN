# Backend Architecture and Progress Report
**Project:** Student Registration Network (SRN)
**Module:** Backend API
**Document Status:** Finalized

---

## 1. Architectural Overview

### 1.1 Core Infrastructure
- **Runtime Environment:** Node.js paired with the Express.js framework.
- **Database Layer:** PostgreSQL instance managed via Supabase.
- **Object-Relational Mapping (ORM):** Prisma.
- **Caching & Rate Limiting:** Redis integration via the `ioredis` client.
- **Authentication Protocol:** JSON Web Tokens (JWT) handling Access and Refresh lifecycles, supplemented by Google OAuth 2.0.
- **Payment Processing:** Razorpay API integration.
- **Telemetry & Error Tracking:** Sentry SDK (`@sentry/node`, `@sentry/profiling-node`).

### 1.2 DevOps & CI/CD
- **Containerization:** Multi-stage Docker configurations designed to handle complex C++ dependencies (e.g., `canvas`).
- **Continuous Integration:** GitHub Actions (`main.yml`) orchestrating automated testing, build processes, and Docker Hub registry pushes.
- **Deployment Environment:** Render Platform (`render.yaml`).

---

## 2. Implementation Matrix

| Module | Status | Technical Description |
|---|---|---|
| **Authentication System** | Deployed | Comprehensive JWT lifecycle management, User Registration, Google OAuth integration, and OTP-based verification workflows. |
| **Membership & ID Generation** | Deployed | Secure membership registration utilizing the `canvas` library to dynamically render and export verifiable ID cards with integrated QR codes. |
| **Profile Management** | Deployed | Data validation pipelines for fetching, updating, and synchronizing user profiles and avatar assets. |
| **Payment Gateway** | Deployed | Razorpay transaction pipelines processing membership dues and event ticketing. |
| **Application Telemetry** | Deployed | Enterprise-grade Sentry alerting configured to capture unhandled exceptions and performance bottlenecks. |

---

## 3. Quality Assurance & Testing Framework

The testing ecosystem is engineered to validate isolated logic and complex integration pathways.

### 3.1 Validation Suite (Jest & Supertest)
- **Suite Volume:** 37 passing assertions.
- **Test Coverage:** Authentication middleware, Role-Based Access Control (RBAC), user profile mutations, API health verifications, and standardized response formatters.
- **Mocking Strategy:** Complete abstraction of Redis and Supabase network layers to ensure deterministic, offline-capable test execution.

---

## 4. Incident Resolution & Debugging Log

### 4.1 Hazardous Production Database Migrations
- **Root Cause:** The initial Docker configuration initiated the production container utilizing `npx prisma db push --accept-data-loss`. In a production environment, this flag would forcibly drop columns during schema conflicts, risking catastrophic data loss.
- **Resolution:** Stripped the `--accept-data-loss` flag from the `Dockerfile` boot sequence. The container is now engineered to fail safely rather than executing destructive schema alterations.

### 4.2 Sentry CLI Authentication Deadlock
- **Root Cause:** Executing `sentry auth login` via the CLI induced a process hang, as the environment could not spawn the requisite local browser session to complete the OAuth handshake.
- **Resolution:** Bypassed the browser dependency by manually provisioning a User Auth Token within the Sentry Dashboard and securely injecting it into the global `~/.sentryclirc` configuration file.

---

## 5. API Routing Topology

### Endpoints (Express `/api/*`)
- `/auth/register`, `/auth/login`, `/auth/google` — Secure authentication gateways.
- `/users/profile` — Authorized user data resolution and mutation.
- `/events/*` — Public and protected event data queries.
- `/memberships/*` — Membership upgrading and Canvas ID generation operations.
- `/payments/create-order`, `/payments/verify` — Razorpay webhook and transaction verification layers.

---

## 6. Strategic Recommendations
1. **Version-Controlled Database Migrations:** Deprecate the use of `prisma db push` in deployment environments. Implement `prisma migrate deploy` to ensure strictly versioned, rollback-capable schema evolutions.
