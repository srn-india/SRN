# Quick Task 006: Public Donation Route & Guest Payment Support

## Context & Objective
Remove `<ProtectedRoute>` from `/donate` in `artifacts/srn-website/src/App.jsx` and enable guest/unauthenticated supporters to donate seamlessly via both Razorpay and Manual (UPI/Bank Transfer).

## Requirements
1. **Frontend Route Unprotected**:
   - In `artifacts/srn-website/src/App.jsx`, remove `<ProtectedRoute>` wrapping around `/donate`.
2. **Frontend Donation Component**:
   - In `artifacts/srn-website/src/pages/Donate.jsx`:
     - Remove mandatory `user` / profile picture check in `handleSubmitRazorpay`.
     - Pass optional `Authorization` token (use if present, omit if guest).
     - Include full donor metadata (`firstName`, `lastName`, `email`, `phone`, `panNumber`, `state`, `city`, `address`, `purpose`) in Razorpay and Manual payment API requests.
3. **Backend Payment Routes & Controllers**:
   - In `artifacts/srn-backend/src/modules/payment/payment.routes.ts`:
     - Remove top-level `router.use(protect)`.
     - Apply `optionalAuth` to `/api/payments/key`, `/api/payments/order`, and `/api/payments/verify`.
   - In `artifacts/srn-backend/src/modules/payment/payment.controller.ts`:
     - In `createOrder`: if `req.user?.id` is not present, require `email` and lookup or create user record by email, populating name, phone, PAN, and address.
     - In `verifyPayment`: pass optional `userId` (`req.user?.id`).
   - In `artifacts/srn-backend/src/modules/payment/payment.service.ts`:
     - In `verifyPayment`: verify payment ownership if user is logged in, or resolve `effectiveUserId = payment.userId` for verified guest transactions.

## Verification Gate
- Run `npm run build` in `artifacts/srn-website`.
- Run `npm run build` in `artifacts/srn-backend`.
