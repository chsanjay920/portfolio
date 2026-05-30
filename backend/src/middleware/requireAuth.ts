import type { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError.js';
import { verifyUserToken, type JwtUserPayload } from '../utils/auth.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Missing Bearer token'));
    return;
  }

  try {
    req.user = verifyUserToken(token);
    next();
  } catch {
    next(new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token'));
  }
}

