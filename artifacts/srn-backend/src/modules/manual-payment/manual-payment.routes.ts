import { Router } from 'express';
import * as ctrl from './manual-payment.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { upload } from '../../utils/upload';

const router = Router();

// ── User routes (authenticated) ──────────────────────────────────────────────
router.post('/submit', protect, ctrl.submit);
router.get('/my', protect, ctrl.getMyPayments);
router.post('/upload-screenshot', protect, upload.single('file'), ctrl.uploadScreenshot);

// ── Admin routes ─────────────────────────────────────────────────────────────
router.get('/admin/all', protect, restrictTo('ADMIN'), ctrl.getAllPayments);
router.patch('/admin/:id/approve', protect, restrictTo('ADMIN'), ctrl.approvePayment);
router.patch('/admin/:id/reject', protect, restrictTo('ADMIN'), ctrl.rejectPayment);
router.post('/admin/:userId/send-idcard', protect, restrictTo('ADMIN'), ctrl.sendIdCard);

export default router;
