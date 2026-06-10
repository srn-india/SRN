# Sashakt Rashtra Nirman (SRN) Backend Infrastructure

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

A production-grade, highly scalable backend infrastructure for the Sashakt Rashtra Nirman (SRN) platform. This system manages NGO operations, user engagement, forum discussions, events, and secure payment processing.

---

## Core Features

- **Authentication**: Google OAuth 2.0 integration and JWT-based session management.
- **Security**: Token blacklisting implemented with Redis and granular route protection middleware.
- **Cloud Storage**: Enterprise-grade resource management utilizing Supabase Storage buckets.
- **Community Engagement**: Robust Forum module supporting threaded discussions and comments.
- **Content Management**: High-performance post system featuring pagination, search, and premium filters.
- **Event Management**: Complete lifecycle tracking for events, including registration and attendee management.
- **Payment Processing**: Integrated Razorpay gateway for memberships and secure donations.
- **API Documentation**: Automated OpenAPI 3.0 documentation via Swagger UI.

---

## Recent Architecture & Performance Updates

- **Database Connection Pooling**: Migrated Supabase PgBouncer from Session Mode to Transaction Mode, supporting massive concurrent loads without connection exhaustion (`EMAXCONNSESSION`).
- **Query Optimization**: Implemented explicit B-Tree Indexes (`@@index`) across all Prisma schema foreign keys to eliminate sequential scan bottlenecks flagged by the Supabase Performance Advisor.
- **Read-Heavy Caching**: Integrated `ioredis` to cache high-traffic public endpoints (e.g., Event listings), drastically reducing direct database reads and lowering latency to <100ms under load.
- **Load Testing Infrastructure**: Established automated `k6` benchmark scripts (`tests/load/`) to simulate highly concurrent read/write traffic and ensure production readiness.
- **Security Enhancements**: Configured `express-rate-limit` and `helmet` middleware to protect against brute-force attacks and satisfy OWASP security standards.

---
## Technical Stack

- **Runtime**: Node.js (Version 20 and above)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Caching & Session**: Redis (ioredis)
- **Object Storage**: Supabase Storage
- **Testing Suite**: Jest and Supertest
- **Documentation**: Swagger/OpenAPI
- **Orchestration**: Docker and Docker Compose
- **CI/CD**: GitHub Actions

---

## Implementation Guide

### 1. Prerequisites
- Docker and Docker Compose
- Node.js LTS Environment

### 2. Configuration
Establish a `.env` file in the root directory with the following parameters:
```bash
PORT=3000
DATABASE_URL="your_postgresql_url"
REDIS_URL="your_redis_url"
JWT_SECRET="your_secret"
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_ROLE_KEY="your_key"
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
RAZORPAY_KEY_ID="your_key"
RAZORPAY_KEY_SECRET="your_secret"
```

### 3. Local Development
```bash
# Install package dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Execute development server
npm run dev
```

### 4. Containerized Deployment
```bash
docker-compose up --build -d
```

---

## Quality Assurance

The project utilizes an automated testing suite to ensure system integrity.

```bash
# Execute integration tests
npm test

# Generate coverage reports
npm run test:coverage
```

---

## API Documentation

The interactive API documentation is accessible via the following endpoint once the service is active:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## CI/CD Pipeline

Continuous Integration is managed via GitHub Actions. Every commit to the primary branch initiates:
1. Environment initialization.
2. Dependency synchronization.
3. Execution of the integration test suite.
4. Validation of the Docker build process.

---

## Project Directory Structure

```text
src/
├── config/         # System configurations
├── lib/            # External service clients
├── middleware/     # Protection and validation layers
├── modules/        # Domain-specific logic
├── utils/          # Utility functions
└── tests/          # Integration test suite
```

---

## License
This software is proprietary. Unauthorized copying or distribution is prohibited.
