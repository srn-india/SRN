import { Router } from 'express';
import * as membershipController from './membership.controller';
import { protect, optionalAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';

const router = Router();

// Public / Optional Auth routes for membership OTP verification and normal registration
router.post('/send-otp', optionalAuth, membershipController.sendMembershipOtp);
router.post('/verify-otp', optionalAuth, membershipController.verifyMembershipOtp);
router.post('/register-normal', optionalAuth, membershipController.registerNormal);

router.use(protect);

/**
 * @swagger
 * /api/memberships/me:
 *   get:
 *     summary: Get current user's membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membership details
 */
router.get('/me', membershipController.getMyMembership);


/**
 * @swagger
 * /api/memberships/me/id-card:
 *   get:
 *     summary: Download ID card
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ID Card image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/me/id-card', membershipController.generateIdCard);
router.get('/me/receipt', membershipController.downloadReceipt);


/**
 * @swagger
 * /api/memberships/{id}/cancel:
 *   patch:
 *     summary: Cancel current user's membership
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Membership cancelled
 */
router.patch('/:id/cancel', membershipController.cancelMyMembership);

/**
 * @swagger
 * /api/memberships:
 *   get:
 *     summary: Get all memberships (Admin only)
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all memberships
 */
router.get('/export/excel', restrictTo('ADMIN'), membershipController.exportMembershipsExcel);
router.get('/', restrictTo('ADMIN'), membershipController.getAllMemberships);
router.delete('/:id', restrictTo('ADMIN'), membershipController.deleteMembership);
router.post('/admin/:id/send-idcard', restrictTo('ADMIN'), membershipController.resendIdCard);

export default router;
