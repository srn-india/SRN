---
id: 004-resend-email-integration
title: "Replace Backend Mail Logic with Resend API"
date: "2026-09-23"
status: in-progress
---

# Plan: Replace Backend Mail Logic with Resend API

## Objective
Replace SMTP-based mailing logic in `artifacts/srn-backend` with the **Resend HTTPS REST API** (`resend` SDK), bypassing Render's free tier outbound SMTP port blocks (`ENETUNREACH 587/465`). Ensure all emails (Membership OTPs, Welcome emails, Payment receipts, Admin notifications, Auth verification) route reliably through Resend over HTTPS port 443.

---

## Wave 1: Dependency & Environment Setup
- [x] Task 1.1: Install `resend` package in `artifacts/srn-backend`.
- [x] Task 1.2: Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configuration to `artifacts/srn-backend/.env` with fallback defaults.

---

## Wave 2: Email Service Refactor (`artifacts/srn-backend/src/utils/email.service.ts`)
- [x] Task 2.1: Initialize `Resend` client using `process.env.RESEND_API_KEY`.
- [x] Task 2.2: Refactor `sendEmail(...)` to dispatch directly via `resend.emails.send(...)` over HTTPS.
- [x] Task 2.3: Support rich HTML emails, attachments (base64 buffer conversion for Resend), and fallback error logging.
- [x] Task 2.4: Ensure all tier-specific templates (`sendRashtraNirmanKartaOtpEmail`, `sendRashtraMitraOtpEmail`, `notifyUserOfOTP`, etc.) retain full branding and work seamlessly through Resend.

---

## Wave 3: Verification & Build Gates
- [x] Task 3.1: Execute isolated script testing `resend.emails.send` with the user's API key.
- [x] Task 3.2: Verify OTP dispatch flow (`POST /api/memberships/send-otp`).
- [x] Task 3.3: Run `npm run build` in `artifacts/srn-backend`.
- [x] Task 3.4: Generate `SUMMARY.md` and update `.planning/STATE.md`.
