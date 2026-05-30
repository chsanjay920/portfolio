import jwt from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';
import { env } from './env.js';

export interface JwtUserPayload {
  sub: string;
  email: string;
}

export function signUserToken(payload: JwtUserPayload): string {
  const secret: Secret = env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: env.JWT_EXPIRES_IN as any });
}

export function verifyUserToken(token: string): JwtUserPayload {
  const secret: Secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as JwtUserPayload;
}

