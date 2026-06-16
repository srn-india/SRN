import { Router } from 'express';
import * as eventsController from './events.controller';
import { validate } from '../../middleware/validate';
import { protect } from '../../middleware/auth';
import { upload } from '../../utils/upload';
import { restrictTo } from '../../middleware/role';
import { createEventSchema } from './events.validation';

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: List all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 */
router.get('/', eventsController.getEvents);
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event details
 */
router.get('/:id', eventsController.getEventById);

// Protected routes
router.use(protect);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Registered successfully
 */
router.post('/:id/register', eventsController.registerForEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, date, location]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *               location: { type: string }
 *               capacity: { type: integer }
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', protect, restrictTo('ADMIN'), upload.single('image'), validate(createEventSchema), eventsController.createEvent);

/**
 * @swagger
 * /api/events/{id}/attendees:
 *   get:
 *     summary: Get list of attendees for an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of attendees
 */
router.get('/:id/attendees', protect, restrictTo('ADMIN'), eventsController.getAttendees);

router.delete('/:id', protect, restrictTo('ADMIN'), eventsController.deleteEvent);

export default router;
