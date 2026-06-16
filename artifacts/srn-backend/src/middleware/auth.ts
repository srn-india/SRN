import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/cache';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, 'Please log in to access this resource', null, 401);
    }

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return sendError(res, 'Token is blacklisted. Please log in again.', null, 401);
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        return sendError(res, 'The user belonging to this token no longer exists.', null, 401);
      }

      req.user = user;
      next();
    } catch (jwtError: any) {
      logger.warn(`JWT Verification Error: ${jwtError.message || jwtError}`);
      return sendError(res, 'Invalid or expired token. Please log in again.', null, 401);
    }
  } catch (error: any) {
    logger.error(`Auth Middleware Error: ${error.stack || error.message}`);
    return sendError(res, 'An error occurred during authentication', error, 500);
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next();
    }

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (user) {
        req.user = user;
      }
    } catch (jwtError) {
      // Ignore jwt errors for optional auth
    }
    next();
  } catch (error) {
    next();
  }
};
