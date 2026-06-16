import { Router } from 'express';
import multer from 'multer';
import { submitArticle, getArticles, getArticleById, approveArticle, deleteArticle } from './article.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { submitArticleSchema } from './article.schema';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Management of user-submitted articles (Jan Samwad)
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Submit a new article (Jan Samwad)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [authorName, email, phone, articleCategory, title, summary, content]
 *             properties:
 *               authorName: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               articleCategory: { type: string }
 *               title: { type: string }
 *               summary: { type: string }
 *               content: { type: string }
 *               file: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Article submitted successfully
 */
router.post(
  '/',
  protect,
  upload.single('file'),
  validate(submitArticleSchema),
  submitArticle
);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get('/', protect, restrictTo('ADMIN'), getArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get article details by ID (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article details
 */
router.get('/:id', protect, restrictTo('ADMIN'), getArticleById);

/**
 * @swagger
 * /api/articles/{id}/approve:
 *   patch:
 *     summary: Approve a submitted article (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article approved
 */
router.patch('/:id/approve', protect, restrictTo('ADMIN'), approveArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete/Reject an article permanently (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article deleted
 */
router.delete('/:id', protect, restrictTo('ADMIN'), deleteArticle);

export default router;
