---
id: 003-membership-email-otp
title: "Gmail OTP Verification for Rashtra Mitra & Rashtra Nirman Karta in Become Member Flow"
date: "2026-09-23"
status: in-progress
---

# Plan: Membership Email OTP Verification (Rashtra Mitra & Rashtra Nirman Karta)

## Objective
Implement a robust Gmail/Email OTP verification flow in Step 2 (`Details & Role`) of `/become-member` for both:
1. **Rashtra Mitra (सामान्य सदस्यता / Supporter Membership)**
2. **Rashtra Nirman Karta (सक्रिय सदस्यता / Active Membership)**

Include bespoke, separate email templates for each tier with rich SRN branding and clear verification messaging.

---

## Wave 1: Backend Email Templates & OTP Endpoints (`srn-backend`)
- [x] Task 1.1: Create dedicated HTML email generators in `artifacts/srn-backend/src/utils/email.service.ts`:
  - `sendRashtraNirmanKartaOtpEmail(email, otpCode, applicantName)`: Tailored for active grassroots leadership, organizational responsibilities, and official ID card issuance.
  - `sendRashtraMitraOtpEmail(email, otpCode, applicantName)`: Tailored for community volunteering, nationwide welfare initiatives, and Janmant open platform access.
- [x] Task 1.2: Implement OTP store & rate-limiting logic in `artifacts/srn-backend/src/modules/membership/membership.service.ts`:
  - Generate cryptographically secure 6-digit OTP.
  - Store in Redis (with in-memory fallback for local resiliency) with 10-minute TTL.
  - Limit OTP generation to prevent spamming.
- [x] Task 1.3: Add API routes and controller handlers in `artifacts/srn-backend/src/modules/membership/`:
  - `POST /api/memberships/send-otp` (Public / Optional Auth): Takes `{ email, tier, name }`, sends customized tier email.
  - `POST /api/memberships/verify-otp` (Public / Optional Auth): Takes `{ email, otp }`, verifies code and returns verification token/flag.

---

## Wave 2: Frontend OTP Verification UI & Validation (`srn-website`)
- [x] Task 2.1: In `artifacts/srn-website/src/pages/BecomeMember.jsx`, add OTP verification state machine:
  - Track `isEmailVerified`, `otpSent`, `otpCode`, `otpLoading`, `otpVerifying`, `resendCountdown`, `otpError`, `otpSuccess`.
- [x] Task 2.2: Upgrade Step 2 (`Details & Role`) Email field:
  - Add inline "Send OTP" / "Resend OTP" button.
  - Add animated OTP drawer with 6-digit input, countdown timer, and "Verify Code" action.
  - Render verified status badge (`✓ Verified`) upon successful verification with ability to reset/change email.
- [x] Task 2.3: Enforce verification in `handleNext`:
  - Require valid email and completed OTP verification before proceeding to Step 3 (`Confirmation`).
  - Pass verified email through to final membership registration.

---

## Wave 3: Verification & Build Gates
- [x] Task 3.1: Verify email sending with both "active" and "normal" tier payloads.
- [x] Task 3.2: Verify OTP validation (success, invalid code, expiry).
- [x] Task 3.3: Verify Step 2 validation gate prevents proceeding without verified email.
- [x] Task 3.4: Run `npm run build` in `artifacts/srn-backend` and `artifacts/srn-website`.
- [x] Task 3.5: Create `SUMMARY.md` and update `.planning/STATE.md`.
