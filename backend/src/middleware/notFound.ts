import type { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError.js';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'NOT_FOUND', 'Route not found'));
}

