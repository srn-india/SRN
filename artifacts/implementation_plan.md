# Implementation Plan - Database Schema Refactoring

This plan outlines the implementation details for the 10 recommended database schema improvements in the SRN platform backend and frontend.

## User Review Required

> [!WARNING]
> This refactor changes key enums (`Role`, statuses) and model types (`Float` to `Decimal`). A database migration is required. Existing database rows will need to be mapped (e.g., converting user roles from `MEMBER` to `USER` and setting active memberships, converting string statuses to uppercase enums).
> We will generate a migration file and double-check it before applying it to the Supabase production/test database.

## Proposed Changes

### Database Layer (Backend)

#### [MODIFY] [schema.prisma](file:///Users/anshjohnson/SRN/artifacts/srn-backend/prisma/schema.prisma)
1. **Payment Model:**
   * Change `amount` type from `Float` to `Decimal` using `@db.Decimal(10,2)`.
   * Add `PaymentType` enum (`MEMBERSHIP`, `DONATION`, `EVENT`).
   * Add `type` field of type `PaymentType` on `Payment`.
   * Add optional `purpose` field on `Payment`.
2. **Membership Plan:**
   * Add `MembershipPlan` enum (`BASIC`, `PREMIUM`, `LIFETIME`).
   * Change `plan` field on `Membership` from `String` to `MembershipPlan`.
3. **Complaint Status:**
   * Add `ComplaintStatus` enum (`PENDING`, `UNDER_REVIEW`, `RESOLVED`, `REJECTED`).
   * Change `status` field on `Complaint` from `String` to `ComplaintStatus`.
4. **Janmant Article Status:**
   * Add `ArticleStatus` enum (`PENDING`, `APPROVED`, `REJECTED`).
   * Change `status` on `JanmantArticle` from `String` to `ArticleStatus`.
5. **Post Application Status:**
   * Add `ApplicationStatus` enum (`PENDING`, `APPROVED`, `REJECTED`).
   * Change `status` on `PostApplication` from `String` to `ApplicationStatus`.
6. **New Donation Model:**
   * Create `Donation` model to store detailed donation reports separate from membership payments.
7. **New RefreshToken Model:**
   * Create `RefreshToken` model to support secure JWT refresh cycles.
8. **User Roles Decoupling:**
   * Change `Role` enum to only have `USER` and `ADMIN` (removing `MEMBER` role as membership is now strictly determined by the `Membership.status` model relation).

---

### Backend Logic Refactoring

#### [MODIFY] [payment.service.ts](file:///Users/anshjohnson/SRN/artifacts/srn-backend/src/modules/payment/payment.service.ts)
- Update `createOrder` to accept `type` and optional `purpose`.
- Update `verifyPayment` to only register membership if the payment type is `MEMBERSHIP`.
- Upon successful donation verification, create a record in the new `Donation` table.

#### [MODIFY] [membership.service.ts](file:///Users/anshjohnson/SRN/artifacts/srn-backend/src/modules/membership/membership.service.ts)
- Update functions to use `MembershipPlan` enum instead of plan strings.
- Decouple role assignments (no longer setting `role = MEMBER` since role is strictly `USER` or `ADMIN`).

#### [MODIFY] Controllers and Routes
- Update routes/controllers for complaints, articles, and applications to use the new Uppercase Enums instead of Capitalized strings (e.g. `'PENDING'` instead of `'Pending'`).

---

### Frontend Layer

#### [MODIFY] [AdminDashboard.jsx](file:///Users/anshjohnson/SRN/artifacts/srn-website/src/pages/AdminDashboard.jsx)
- Update status color conditions and checks to match the new Uppercase Enum values (e.g., check `status === "APPROVED"` instead of `"Approved"`, `status === "PENDING"` instead of `"Pending"`).
- Update the memberships display logic: check user membership status via their active `Membership` entries rather than checking if their role is `MEMBER`.

#### [MODIFY] [BecomeMember.jsx](file:///Users/anshjohnson/SRN/artifacts/srn-website/src/pages/BecomeMember.jsx)
- Pass `type: "MEMBERSHIP"` to `/api/payments/order`.

#### [MODIFY] [Donate.jsx](file:///Users/anshjohnson/SRN/artifacts/srn-website/src/pages/Donate.jsx)
- Pass `type: "DONATION"` and `purpose: formData.purpose` to `/api/payments/order`.

---

## Verification Plan

### Automated Tests
- Run `pnpm --filter srn-backend test` to ensure existing and new integration tests run successfully.
- Run `pnpm typecheck` across both backend and frontend to verify type-level correctness of the refactor.

### Manual Verification
- Verify the Prisma migration script locally before execution.
- Walk through user membership registration and donation payment checkout flows to verify that the transactions map correctly.
