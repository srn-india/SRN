---
id: 002-membership-tiers
title: "Membership Tiers Stepper (Active vs Normal Membership) with Benefit Comparisons"
date: "2026-09-16"
status: in-progress
---

# Plan: Membership Tiers Stepper (Active vs Normal Membership)

## Objective
Introduce a dedicated membership tier selection step in `BecomeMember.jsx` distinguishing between:
1. **Active Membership (सक्रिय सदस्यता)**: Full grassroots leadership, decision-making, official ID card, and ground authority. Paid tier (UPI/QR or Razorpay).
2. **Normal Membership (सामान्य सदस्यता)**: Free registration focusing on information collection, community involvement, newsletter, public forums, and local volunteer initiatives without a payment barrier.

## Benefits Breakdown

### Active Membership (सक्रिय सदस्यता)
- **Post Participation**: Direct eligibility to apply for and hold organizational posts & committees.
- **Bridge the Gap**: Act as a verified liaison between grassroots citizens, local administration, and state executive bodies.
- **Direct Engagement**: Exclusive strategy sessions and direct coordination with state and national leadership.
- **Right to Take Decision**: Voting rights in regional assembly and consultative policy formulation.
- **Official Physical & Digital ID Card**: Verified Sashakt Rashtra Nirman ID card with unique member credential and QR verification.
- **Block to District Level Elevation**: Clear promotional pathway from Block level (प्रखंड) to District (ज़िला) and State leadership roles.
- **Access to Publications & Data**: Full access to internal Janmant research publications, field survey data, and statutory whitepapers.

### Normal Membership (सामान्य सदस्यता) — Free / Information Collection
- **Registered Citizen Membership**: Official registration in the nationwide SRN social empowerment network.
- **Member Dashboard Access**: Access your online member account and track community initiatives.
- **Community Updates & Newsletter**: Monthly digest and instant WhatsApp/Email circulars on key national & local campaigns.
- **Volunteer Drive Participation**: Priority alerts to participate in disaster relief, blood donation camps, and cleanliness drives.
- **Janmant Reader & Open Forum Access**: Free reading of citizen journalism articles and open discussions.
- **Upgrade Flexibility**: Freedom to upgrade to Active Membership anytime with 1-click elevation.

## Wave 1: Backend Support for Free Normal Membership
- [ ] Task 1.1: Add `POST /api/memberships/register-normal` in `artifacts/srn-backend/src/modules/membership/` to activate `BASIC` membership for authenticated user without requiring payment.
- [ ] Task 1.2: Send welcome email to Normal Member acknowledging their membership in the movement.
- [ ] Task 1.3: Expose `membershipPlan` in user auth payload (`auth.controller.ts`) so frontend distinguishes between `BASIC` and `PREMIUM`.

## Wave 2: Frontend Stepper & UI Redesign (`BecomeMember.jsx`)
- [ ] Task 2.1: Expand `steps` in `BecomeMember.jsx` from 3 to 4 steps:
  - Step 1: **Membership Tier** (Active vs Normal with side-by-side interactive comparison cards and comprehensive feature checklist).
  - Step 2: **Personal Details** (First Name, Last Name, Email, Phone, DOB).
  - Step 3: **Address & Role** (State, District/City, Profession, Area of Interest).
  - Step 4: **Confirmation / Activation** (Instant 1-click Free Activation for Normal; Payment gateway / QR upload for Active).
- [ ] Task 2.2: Add rich interactive badges, selection pills, and feature checklist with icons (`CheckCircle2`, `Award`, `ShieldCheck`, `Users`, `FileText`, `Sparkles`).
- [ ] Task 2.3: Wire form submission so Normal Membership calls `/api/memberships/register-normal` and smoothly redirects to dashboard, while Active Membership completes Razorpay/QR flow.

## Wave 3: Verification & Polish
- [ ] Task 3.1: Verify Normal Membership registration flow end-to-end.
- [ ] Task 3.2: Verify Active Membership flow preserves payment, QR, and ID card generation.
- [ ] Task 3.3: Run `npm run build` in both `artifacts/srn-website` and `artifacts/srn-backend`.
- [ ] Task 3.4: Update `.planning/STATE.md` and complete GSD summary.
