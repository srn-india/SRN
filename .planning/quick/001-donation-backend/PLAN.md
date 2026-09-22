---
id: 001-donation-backend
title: "Enterprise Backend and Database for Donation Portal"
date: "2026-09-16"
status: in-progress
---

# Plan: Enterprise Backend and Database for Donation Portal

## Objective
Build a dedicated, production-grade backend and PostgreSQL database subsystem for the SRN donation portal. Support both guest and logged-in donations, generate Section 80G compliant PDF receipts, send transactional confirmation emails, and integrate cleanly with the frontend.

## Wave 1: Database Schema & Migration
- [ ] Task 1.1: Add `DonationPaymentMethod` and `DonationStatus` enums and `DonationRecord` model to `artifacts/srn-backend/prisma/schema.prisma`.
- [ ] Task 1.2: Add relation `donations DonationRecord[]` to `User` model in `schema.prisma`.
- [ ] Task 1.3: Run `npx prisma db push` and `npx prisma generate` to synchronize PostgreSQL database and generate Prisma Client types.

## Wave 2: Backend Module (`src/modules/donation`)
- [ ] Task 2.1: Implement `src/modules/donation/donation.service.ts` with 80G receipt number generation, DB transactions, email dispatch, and admin actions.
- [ ] Task 2.2: Implement `src/modules/donation/donation.controller.ts` with Zod validation and request handlers.
- [ ] Task 2.3: Implement `src/modules/donation/donation.routes.ts` with public upload, manual submission, receipt download, and protected admin routes.
- [ ] Task 2.4: Upgrade `src/utils/receipt.service.ts` with Section 80G compliant layout, PAN, address, Trust registration numbers, and digital signatures.
- [ ] Task 2.5: Register `donationRoutes` in `src/index.ts`.

## Wave 3: Frontend Integration & Spacing Polish
- [ ] Task 3.1: Connect `Donate.jsx` to `/api/donations/upload-proof` and `/api/donations/manual`.
- [ ] Task 3.2: Allow guest donations without requiring user account/avatar modal.
- [ ] Task 3.3: Refine spacing across `Donate.jsx` (harmonious card paddings, comfortable input sizes, clean grid gaps).
- [ ] Task 3.4: Update `AdminDashboard.jsx` to display structured donor details (PAN, Campaign, City, State, 80G Receipt Number).

## Wave 4: Verification & Build Gates
- [ ] Task 4.1: Test manual donation submission API with curl/ts script.
- [ ] Task 4.2: Run `npm run build` in `artifacts/srn-backend`.
- [ ] Task 4.3: Run `npm run build` in `artifacts/srn-website`.
- [ ] Task 4.4: Update `.planning/STATE.md` and generate `SUMMARY.md`.
