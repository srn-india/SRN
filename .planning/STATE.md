# GSD Project State

## Active Milestone
**Milestone:** Initial Core Infrastructure & Operations  
**Active Phase:** Membership Tiers & Donation Backend  
**Status:** In Progress

## Quick Tasks Completed
| Task | Date | Status | Description |
|------|------|--------|-------------|
| `009-avatar-live-deployment` | 2026-10-26 | COMPLETE ✓ | Corrected stale Render repository/deployment and hardened avatar response handling with regression tests |
| `008-admin-user-avatar` | 2026-10-26 | COMPLETE ✓ | Admin-only profile image uploads for any user, paginated Manage Users view, ID-card refresh and API/UI tests |
| `007-donation-admin-review` | 2026-10-22 | COMPLETE ✓ | Donations require admin approval before receipt generation; correction audit emailed to donors and receipt resend available |
| `006-public-donation-route` | 2026-09-23 | COMPLETE ✓ | Public donation route, unblocking guest donations via Razorpay and Manual methods |
| `005-public-membership-govid` | 2026-09-23 | COMPLETE ✓ | Public membership route, multi-document Government ID (Aadhaar, PAN, Voter ID, DL) with database sync |
| `004-resend-email-integration` | 2026-09-23 | COMPLETE ✓ | Resend HTTPS REST API integration replacing SMTP (bypasses Render port blocks) |
| `003-membership-email-otp` | 2026-09-23 | COMPLETE ✓ | Gmail OTP verification with bespoke emails for Rashtra Mitra & Rashtra Nirman Karta |
| `002-membership-tiers` | 2026-09-16 | COMPLETE ✓ | Stepper with Active vs Normal membership and benefit comparisons |
| `001-donation-backend` | 2026-09-16 | IN_PROGRESS | Enterprise backend and PostgreSQL database for donation portal |

## Session Context
- Integrated Resend HTTPS REST API (`resend` SDK) via environment variable `RESEND_API_KEY` across `artifacts/srn-backend/src/utils/email.service.ts`.
- Bypassed Render's free tier egress firewall which blocks outbound SMTP ports 25, 465, and 587 (`connect ENETUNREACH 587`), routing all emails over standard HTTPS Port 443.
- Verified live email dispatch for bespoke Rashtra Nirman Karta & Rashtra Mitra OTP emails and general transactional emails to `johnsonansh32@gmail.com`.
- Ran full builds across both backend and website with 0 errors.

- Implemented full Gmail OTP verification in Step 2 (`Details & Role`) of `/become-member` with mandatory verification before proceeding to Step 3.
- Drafted two distinct, rich bilingual HTML email templates in `email.service.ts`: `sendRashtraNirmanKartaOtpEmail` (Gold/Saffron leadership styling with ID card info) and `sendRashtraMitraOtpEmail` (Emerald/Saffron community welfare styling with Janmant details).
- Added `POST /api/memberships/send-otp` and `POST /api/memberships/verify-otp` with Redis TTL caching, in-memory resiliency, 45s rate-limiting, and brute-force prevention.
- Added animated OTP verification drawer, 60s resend timer, 6-digit input, and live verified badge in `BecomeMember.jsx`.
- Verified live email delivery to `anshjohnson69@gmail.com` and confirmed clean builds across both frontend and backend.
- Completed Membership Type Stepper in `BecomeMember.jsx` with enhanced **Rashtra Nirman Karta** (सक्रिय सदस्य) and **Rashtra Mitra** (सामान्य समर्थक सदस्य) tier nomenclature.
- Unified Personal Details and Address & Role into a single, beautifully spaced Step 2 (`Details & Role`), streamlining the process to an intuitive 3-step wizard (Membership Tier → Details & Role → Confirmation).
- Integrated official Passport-style Photograph Upload directly into Step 2 with automatic client compression, live thumbnail preview, and persistence to the user profile and ID card generator.
- Added candidate summary badge with live photograph preview in Step 3 Confirmation before final submission.
- Balanced container heights across all steps (~600–660px) to maintain steady visual consistency and keep navigation controls firmly anchored.
- Added backend route `POST /api/memberships/register-normal` and updated `getMe` to expose `membershipPlan`.
- Enriched `getAllPayments` in `manual-payment.service.ts` to include full user profiles (avatar/ID photo, state, district, gender, DOB, role, verification status, and latest membership history).
- Upgraded Admin Dashboard payment verification (`AdminDashboard.jsx`) with comprehensive user identity cards, ID photo preview with lightbox zoom, phone/email contact links, 1-click copy helpers, demographics, and formatted application purpose breakdown.


## Donation Admin Review — 2026-10-22
- New manual donations remain PENDING; no PDF receipt is generated on submission.
- Verified online donations create a PENDING entry in Payment Reviews atomically with payment verification. Online payment amount/reference remain immutable; review entries are excluded from duplicate analytics totals.
- Admins can correct manual donation amount, transaction reference, and purpose before approval. A reason is mandatory for changes; original and corrected values are stored in adminNote and included in the donor email. Receipt uses verified values.
- Approval conditionally updates PENDING status to prevent duplicate issuance. Approved donation receipts can be resent; delivery errors are surfaced in the admin UI.
- Donation copy in English and Hindi states that receipts follow admin approval. Admin review uses the existing accessible Dialog component; CSV includes the review/correction note.
- Verification: backend and frontend production builds pass; 19 focused backend donation tests and all 16 frontend tests pass. Admin UI test verifies corrected details and explanation are submitted together. HTTP checks: frontend /donate 200, backend / 200, unauthenticated admin review endpoint 401.
- Full backend suite: 7 suites blocked by existing Jest/ESM htmlparser2 dependency parse failure (auth, events, health, payment, posts, sanitize, user). The completed full-suite run passed 36 tests across 5 suites before the final additional donation cases were added. Local test Redis also reported connection errors. No live donation or donor email was sent during verification.
- React Doctor: changed-file scan reported no issues, overall score 59/100. Existing frontend bundle-size warning remains.
- Servers started: frontend http://localhost:8080; backend http://localhost:4000 (Redis connected). No database schema migration required. Existing auto-approved historical donations were not altered.
- .planning/ROADMAP.md is absent; work follows the active Membership Tiers & Donation Backend phase recorded above.


## Admin User Profile Images — 2026-10-26
- Added PATCH /api/admin/users/:id/avatar, behind the existing database-backed protect + ADMIN authorization middleware, before multipart parsing. Non-admins cannot update other users' photos or access the new user-management UI.
- Reused avatar storage and the existing upload helper. Accepts PNG/JPEG up to 5 MB, checks file signatures and decodes the image, limits dimensions to 4096 × 4096, and re-encodes to PNG before saving. The original photo remains untouched on invalid input or upload failure.
- Added Manage Users with pagination over the existing admin users API. Image editor is also reachable from membership/payment name editors. Updates refresh user lists, membership/payment photos, and the current admin's auth profile when applicable.
- Active membership ID cards are regenerated after photo changes; ID-card generation failure is surfaced as a warning while preserving the saved photo.
- Verification: both production builds pass. All 16 new backend avatar API tests pass, including unauthenticated/non-admin rejection, database-role authorization over token claims, invalid/corrupt/oversized images, ID-card refresh, and storage failure. All 21 frontend tests pass, including 5 new image-management tests. Full backend run: 56 tests pass across 6 suites; 7 existing suites (auth, events, health, payment, posts, sanitize, user) fail to load because of the existing htmlparser2 Jest/ESM parsing error.
- React Doctor scan includes untracked new source/tests: no new diagnostics, project score 62/100. Existing bundle-size warning remains.
- Running backend root and frontend respond successfully; the live unauthenticated avatar API returns 401. Read-only storage check confirms avatars bucket exists and is public. Automated tests mock persistence and storage; no real user's profile photo was changed.


## Live Avatar Upload Failure — 2026-10-26
- Production diagnosis: srnindia.org had the new avatar editor, but Render srn-backend still referenced https://github.com/Lonewolf-lab/SRN and was serving commit 4932941 from 2026-09-24. That backend predates PATCH /api/admin/users/:id/avatar. The frontend blindly parsed non-JSON error responses, surfacing Safari's generic “The string did not match the expected pattern.” message.
- Corrected the existing Render service repository to https://github.com/srn-india/SRN, retaining main, Docker settings, environment variables and database. Deployed tested commit 35e76c6278bee39caf475bd2523286d005f86ad4 via deploy dep-dbfobed9el5s73fvo1vg. Render reports the service live; startup logs confirm server binding and Redis connection. No Prisma schema, backend dependencies, or Dockerfile changes were needed.
- Avatar editor now checks response content type, handles HTML 404/413/502 and malformed JSON with actionable errors, and rejects success responses without an updated avatar. Existing image remains unchanged on failure.
- Regression tests reproduced the exact browser parsing error before the fix. Verification: both builds pass; all 25 frontend tests and all 16 backend avatar tests pass. React Doctor reports no new issues. The pre-existing full-backend Jest/ESM limitation remains documented above.
- No real user's image was uploaded or changed during diagnostics. Deployment credentials were used in memory only and excluded from files and commits.
