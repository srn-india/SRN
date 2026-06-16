import dotenv from 'dotenv';
dotenv.config();

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

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
import complaintRoutes from './modules/complaint/complaint.routes';
import articleRoutes from './modules/article/article.routes';
import applicationRoutes from './modules/application/application.routes';
import { createServer } from 'http';
import { initSocket } from './lib/socket';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'none'"],
      "script-src": ["'self'"],
      "connect-src": ["'self'"],
      "img-src": ["'self'"],
      "style-src": ["'self'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"]
    }
  }
}));

// Custom Security Headers to satisfy OWASP ZAP
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static Files
app.use('/uploads', express.static('uploads'));

// Rate Limiting
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.'
      });
    }
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
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/applications', applicationRoutes);

Sentry.setupExpressErrorHandler(app);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });
  }

  logger.error(err.stack || err.message);

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  res.status(err.statusCode || 500).json({
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
