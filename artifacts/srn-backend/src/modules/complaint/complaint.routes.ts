import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { upload } from '../../utils/upload';
import * as complaintController from './complaint.controller';
import { createComplaintSchema, updateComplaintStatusSchema, publishComplaintSchema } from './complaint.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Grievance and complaint management
 */

/**
 * @swagger
 * /api/complaints/published:
 *   get:
 *     summary: Retrieve list of published complaints
 *     tags: [Complaints]
 *     responses:
 *       200:
 *         description: List of published complaints
 */
router.get('/published', complaintController.getPublishedComplaints);

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Create a new complaint/grievance
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, state, category, subject, description]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               state: { type: string }
 *               category: { type: string }
 *               subject: { type: string }
 *               description: { type: string }
 *               file: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Complaint created successfully
 */
router.post(
  '/',
  protect,
  upload.single('file'),
  validate(createComplaintSchema),
  complaintController.createComplaint
);

/**
 * @swagger
 * /api/complaints/me:
 *   get:
 *     summary: Get logged-in user's complaints
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's complaint list
 */
router.get(
  '/me',
  protect,
  complaintController.getMyComplaints
);

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     summary: Get all complaints (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all complaints
 */
router.get(
  '/',
  protect,
  restrictTo('ADMIN'),
  complaintController.getComplaints
);

/**
 * @swagger
 * /api/complaints/{id}:
 *   get:
 *     summary: Get a specific complaint details by ID (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Complaint details
 */
router.get(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  complaintController.getComplaintById
);

/**
 * @swagger
 * /api/complaints/{id}/status:
 *   patch:
 *     summary: Update status of a complaint (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Pending, In_Progress, Resolved, Rejected] }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch(
  '/:id/status',
  protect,
  restrictTo('ADMIN'),
  validate(updateComplaintStatusSchema),
  complaintController.updateComplaintStatus
);

/**
 * @swagger
 * /api/complaints/{id}/publish:
 *   patch:
 *     summary: Publish or unpublish a complaint (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isPublished]
 *             properties:
 *               isPublished: { type: boolean }
 *               titleEn: { type: string }
 *               titleHi: { type: string }
 *               resolutionEn: { type: string }
 *               resolutionHi: { type: string }
 *     responses:
 *       200:
 *         description: Publish status updated
 */
router.patch(
  '/:id/publish',
  protect,
  restrictTo('ADMIN'),
  validate(publishComplaintSchema),
  complaintController.publishComplaint
);

/**
 * @swagger
 * /api/complaints/{id}:
 *   delete:
 *     summary: Delete a complaint permanently (Admin only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Complaint deleted successfully
 */
router.delete(
  '/:id',
  protect,
  restrictTo('ADMIN'),
  complaintController.deleteComplaint
);

export default router;
