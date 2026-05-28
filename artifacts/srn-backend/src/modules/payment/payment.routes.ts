import { Router } from 'express';
import * as paymentController from './payment.controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/payments/key:
 *   get:
 *     summary: Get Razorpay Key ID
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Key fetched successfully
 */
router.get('/key', paymentController.getRazorpayKey);

/**
 * @swagger
 * /api/payments/order:
 *   post:
 *     summary: Create a payment order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, currency]
 *             properties:
 *               amount: { type: number }
 *               currency: { type: string, default: 'INR' }
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/order', protect, paymentController.createOrder);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               razorpay_order_id: { type: string }
 *               razorpay_payment_id: { type: string }
 *               razorpay_signature: { type: string }
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post('/verify', protect, paymentController.verifyPayment);

export default router;
