# Quick Task 006 Summary: Public Donation Route & Guest Payment Support

## Changes Implemented

1. **Unprotected Public Donation Route**:
   - Removed `<ProtectedRoute>` from `/donate` in `artifacts/srn-website/src/App.jsx`.
   - Guest visitors and non-logged-in donors can now access the donation page directly without authentication or redirection.

2. **Frontend Guest Donations (`Donate.jsx`)**:
   - Removed the block requiring a logged-in user with a profile picture in `handleSubmitRazorpay`.
   - Updated both Razorpay (`handleSubmitRazorpay`) and Manual (`handleManualSubmit`) payment flows to make the `Authorization` header optional.
   - Sent full donor details (`email`, `firstName`, `lastName`, `phone`, `panNumber`, `state`, `city`, `address`, `purpose`) directly in payment requests.

3. **Backend Guest Payment Handling (`payment.routes.ts`, `payment.controller.ts`, `payment.service.ts`)**:
   - `payment.routes.ts`: Removed global `router.use(protect)` and enabled `optionalAuth` for `/api/payments/key`, `/api/payments/order`, and `/api/payments/verify`.
   - `payment.controller.ts`:
     - `createOrder`: If user is not logged in, retrieves or creates a `User` account by `email` with donor details (`firstName`, `lastName`, `phone`, `panNumber`, `state`, `district`), then links the payment order to `user.id`.
     - `verifyPayment`: Supports both authenticated and unauthenticated callers by passing optional `userId`.
   - `payment.service.ts`:
     - `verifyPayment`: Verifies Razorpay HMAC-SHA256 signature cryptographically and resolves `effectiveUserId = payment.userId` to support guest donations and membership transactions reliably.

## Verification
- `artifacts/srn-backend`: `npm run build` compiled with code 0.
- `artifacts/srn-website`: `npm run build` bundled with code 0.
