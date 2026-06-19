import { Router } from 'express';
import { upload } from '../../utils/upload';
import {
  submitApplication, 
  getApplications, 
  getMyApplication,
  getApplicationById, 
  updateApplicationStatus, 
  deleteApplication 
} from './application.controller';
import { protect, optionalAuth } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';

const admin = restrictTo('ADMIN');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Management of volunteer/member job posting applications
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a new posting application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullName, dob, gender, email, phone, address, qualification, appliedPosition, socialContribution, whyJoin]
 *             properties:
 *               fullName: { type: string }
 *               dob: { type: string }
 *               gender: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               qualification: { type: string }
 *               appliedPosition: { type: string }
 *               currentOccupation: { type: string }
 *               socialContribution: { type: string }
 *               whyJoin: { type: string }
 *               resume: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post('/', optionalAuth, upload.single('resume'), submitApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get('/', protect, admin, getApplications);

/**
 * @swagger
 * /api/applications/me:
 *   get:
 *     summary: Get logged-in user's submitted applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's applications list
 */
router.get('/me', protect, getMyApplication);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get specific application details (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Application details
 */
router.get('/:id', protect, admin, getApplicationById);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status (Admin only)
 *     tags: [Applications]
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
 *               status: { type: string, enum: [Pending, Approved, Rejected] }
 *     responses:
 *       200:
 *         description: Application status updated
 */
router.patch('/:id/status', protect, admin, updateApplicationStatus);

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Application deleted
 */
router.delete('/:id', protect, admin, deleteApplication);

export default router;
