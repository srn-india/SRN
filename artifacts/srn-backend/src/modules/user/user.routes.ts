import { Router } from 'express';
import * as userController from './user.controller';
import { validate } from '../../middleware/validate';
import { protect } from '../../middleware/auth';
import { updateProfileSchema, changePasswordSchema } from './user.validation';
import { upload } from '../../utils/upload';

const router = Router();

// Protect all user routes
router.use(protect);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/me', userController.getProfile);
router.get('/membership', userController.getMembership);


/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               state: { type: string }
 *               district: { type: string }
 *               gender: { type: string }
 *               dateOfBirth: { type: string, format: date }
 *               profilePicture: { type: string, description: "Base64 encoded image string" }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch('/profile', upload.single('avatar'), validate(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

export default router;
