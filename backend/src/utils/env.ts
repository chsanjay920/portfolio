import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  MONGODB_URI: z.string().min(1),
  MONGODB_DBNAME: z.string().min(1).default('portfolio'),

  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),

  CORS_ORIGIN: z.string().min(1).default('http://localhost:4200'),
});

export const env = envSchema.parse(process.env);

