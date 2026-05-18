import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import adminRoutes from './modules/admin/admin.routes';
import eventsRoutes from './modules/events/events.routes';
import postsRoutes from './modules/posts/posts.routes';
import forumRoutes from './modules/forum/forum.routes';
import notificationRoutes from './modules/notification/notification.routes';
import paymentRoutes from './modules/payment/payment.routes';
import membershipRoutes from './modules/membership/membership.routes';
import { createServer } from 'http';
import { initSocket } from './lib/socket';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files
app.use('/uploads', express.static('uploads'));

// Rate Limiting
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  app.use('/api', limiter);
}

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'SRN Backend API is running' });
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/memberships', membershipRoutes);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const httpServer = createServer(app);
initSocket(httpServer);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

export default app;
