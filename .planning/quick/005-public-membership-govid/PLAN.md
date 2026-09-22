---
id: 005-public-membership-govid
title: "Remove Protected Route from /become-member & Add Multi-Gov ID Support"
date: "2026-09-23"
status: in-progress
---

# Plan: Public Membership Route & Multi-Gov ID Verification

## Objective
1. **Unprotect `/become-member`**: Allow unauthenticated/guest users to access `https://srnindia.org/become-member` without forcing login beforehand.
2. **Replace PAN-only with Government ID Selector**:
   - Support **Driver's License (ड्राइविंग लाइसेंस)**, **Aadhaar Card (आधार कार्ड)**, **PAN Card (पैन कार्ड)**, and **Voter ID (मतदाता पहचान पत्र)**.
   - Strict format validation, dynamic placeholders, input masking, and clear error messaging for each ID type.
3. **Database Schema Update**:
   - Add `govIdType` and `govIdNumber` to `User` model in `schema.prisma`.
   - Push schema to Supabase PostgreSQL database.
   - Update user profile endpoints, manual payment service, and admin dashboard displays.

---

## Wave 1: Database Schema & Backend Updates (`srn-backend`)
- [ ] Task 1.1: Add `govIdType` and `govIdNumber` to `User` model in `artifacts/srn-backend/prisma/schema.prisma`.
- [ ] Task 1.2: Run `npx prisma db push` and `npx prisma generate`.
- [ ] Task 1.3: Update `user.validation.ts`, `user.service.ts`, and `user.controller.ts` to validate and persist `govIdType` and `govIdNumber` (and sync `panNumber` if PAN is selected).
- [ ] Task 1.4: Update `manual-payment.service.ts` to include `govIdType` and `govIdNumber` in admin query responses.

---

## Wave 2: Frontend Route & BecomeMember Form (`srn-website`)
- [ ] Task 2.1: Remove `<ProtectedRoute>` wrapping from `/become-member` in `artifacts/srn-website/src/App.jsx`.
- [ ] Task 2.2: In `BecomeMember.jsx`, add Government ID selector UI (Aadhaar, PAN, Voter ID, Driving Licence) with dedicated regex validators and format helper labels.
- [ ] Task 2.3: Ensure `BecomeMember.jsx` handles both logged-in users and guests gracefully (safe optional chaining on `user`, auto-linking verified email from OTP).
- [ ] Task 2.4: Update Step 3 Summary and Submission payloads to include `govIdType` and `govIdNumber`.
- [ ] Task 2.5: Update `AdminDashboard.jsx` to render the selected Gov ID badge (Aadhaar/PAN/Voter/DL) with 1-click copy.

---

## Wave 3: Verification & Build Gates
- [ ] Task 3.1: Verify format validators for Aadhaar (12 digits), PAN (10 chars), Voter ID (3 letters + 7 numbers), Driving Licence (15-16 chars).
- [ ] Task 3.2: Verify unauthenticated navigation to `/become-member`.
- [ ] Task 3.3: Run `npm run build` in `srn-backend` and `srn-website`.
- [ ] Task 3.4: Generate `SUMMARY.md` and update `.planning/STATE.md`.
