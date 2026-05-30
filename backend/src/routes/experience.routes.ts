import { z } from 'zod';
import { ExperienceModel } from '../models/experience.js';
import { createCrudRouter } from './crudFactory.js';

const createSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
});

export const experienceRouter = createCrudRouter({
  model: ExperienceModel as any,
  createSchema,
  updateSchema: createSchema.partial(),
});

