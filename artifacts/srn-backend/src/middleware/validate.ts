import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      // Safely merge query and params if they exist
      if (parsed.query) {
        // Express request query is mutable, but to avoid read‑only issues we replace it
        req.query = { ...req.query, ...parsed.query } as any;
      }
      if (parsed.params) {
        req.params = { ...req.params, ...parsed.params } as any;
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error.name === 'ZodError') {
        const message = error.issues ? error.issues.map((e: any) => e.message).join(', ') : error.message;
        return sendError(res, message, error.issues, 400);
      }
      console.error("Validation threw non-ZodError:", error);
      return sendError(res, `Validation failed: ${error.message || String(error)}`, error, 400);
    }
  };
};
