import { z } from 'zod';

export const objectIdStringSchema = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, 'Invalid ObjectId');

export const linkItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
});

