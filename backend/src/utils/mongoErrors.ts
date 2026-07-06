import { MongoServerError } from 'mongodb';
import type { NextFunction } from 'express';
import { ApiError } from '../middleware/apiError.js';

export function handleMongoWriteError(err: unknown, next: NextFunction): boolean {
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    next(new ApiError(409, 'DUPLICATE_KEY', `A record with this ${field} already exists`));
    return true;
  }
  return false;
}
