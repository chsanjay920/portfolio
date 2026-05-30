import type { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const fallback = new ApiError(500, 'INTERNAL_ERROR', 'Unexpected error');

  const apiErr = err instanceof ApiError ? err : fallback;

  if (apiErr !== fallback) {
    res.status(apiErr.status).json({
      error: {
        code: apiErr.code,
        message: apiErr.message,
        details: apiErr.details,
      },
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error('[portfolio-api] unhandled error', err);
  res.status(500).json({
    error: {
      code: fallback.code,
      message: fallback.message,
    },
  });
}

