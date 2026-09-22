---
id: 002-membership-tiers
title: "Membership Tiers Stepper (Active vs Normal Membership) with Benefit Comparisons"
date: "2026-09-16"
status: complete
---

# Summary: Membership Tiers Stepper & Multi-Tier Support

## Work Completed
1. **Frontend Stepper Redesign (`BecomeMember.jsx`)**:
   - Expanded the stepper from 3 steps to 4 distinct steps:
     - **Step 1: Membership Tier (सदस्यता प्रकार)**
     - **Step 2: Personal Details (व्यक्तिगत विवरण)**
     - **Step 3: Address & Role (पता और भूमिका)**
     - **Step 4: Confirmation (पुष्टिकरण)**
   - Added interactive side-by-side selection cards comparing **Active Membership** and **Normal Membership**.
   - Included all requested benefits for **Active Membership**:
     - **Post Participation**: Eligible to apply for and hold organizational posts & committees.
     - **Bridge the Gap**: Act as a verified liaison connecting public issues with administration & ministers.
     - **Direct Engagement**: Direct strategy meets with national & state leadership.
     - **Right to Take Decisions**: Voting privileges and active participation in regional policy decisions.
     - **Official Verified ID Card**: Verified physical & digital SRN ID card with secure QR code.
     - **Block to District Level Elevation**: Clear merit pathway from Block (प्रखंड) to District (जिला) & State level.
     - **Access Publication & Data**: Full access to Janmant research, field data, and whitepapers.
   - Included simplified, user-friendly benefits for **Normal Membership**:
     - **100% Free Registration**: No fee — simply enter your details to join.
     - **Member Dashboard Access**: Access your online member account and track community initiatives.
     - **Monthly Newsletter & Bulletins**: Monthly digests, updates, and priority circulars on WhatsApp & Email.
     - **Volunteer in Local Drives**: Direct invitations to local tree plantation, blood donation, health, and cleanliness camps.
     - **Janmant Reader Access**: Free access to read citizen journalism articles, complaints, and public discussions.
     - **Upgrade Anytime**: Flexibility to upgrade to Active Membership with official ID card whenever ready.
   - Tailored Step 4 (Confirmation):
     - **Normal Membership**: Free registration with 1-click instant activation, zero payment required, and immediate welcome screen.
     - **Active Membership**: Full QR/UPI contribution (₹101) or online gateway (₹999) verification for official ID card generation.

2. **Backend Multi-Tier Support**:
   - Added `POST /api/memberships/register-normal` in `artifacts/srn-backend/src/modules/membership/` to instantly activate `BASIC` membership without requiring payment.
   - Updated `subscribeUser` in `membership.service.ts` to only generate ID cards for `PREMIUM` (Active) members, keeping `BASIC` as the information-collection supporter tier.
   - Updated `auth.controller.ts` `getMe` endpoint to return `membershipPlan` (`BASIC` vs `PREMIUM`) to distinguish member tiers across the application.

3. **Verification & Quality Gates**:
   - Verified frontend compilation via `npm run build` in `artifacts/srn-website` (0 errors).
   - Verified backend compilation via `npm run build` in `artifacts/srn-backend` (0 errors).
   - Verified route protection and response of `/api/memberships/register-normal`.
