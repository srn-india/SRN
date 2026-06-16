import { Router } from 'express';
import * as forumController from './forum.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { upload } from '../../utils/upload';

const router = Router();

/**
 * @swagger
 * /api/forum/threads:
 *   get:
 *     summary: List all forum threads
 *     tags: [Forum]
 *     responses:
 *       200:
 *         description: List of threads retrieved successfully
 */
router.get('/threads', forumController.getThreads);

/**
 * @swagger
 * /api/forum/threads/{id}:
 *   get:
 *     summary: Get forum thread by ID
 *     tags: [Forum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thread details and comments
 */
router.get('/threads/:id', forumController.getThreadById);

/**
 * @swagger
 * /api/forum/threads:
 *   post:
 *     summary: Create a new forum thread
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Thread created successfully
 */
router.post('/threads', protect, upload.single('image'), forumController.createThread);

/**
 * @swagger
 * /api/forum/threads/{threadId}/comments:
 *   post:
 *     summary: Add a comment to a thread
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/threads/:threadId/comments', protect, forumController.createComment);

router.delete('/threads/:id', protect, restrictTo('ADMIN'), forumController.deleteThread);

export default router;
