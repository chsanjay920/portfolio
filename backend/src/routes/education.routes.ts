import { z } from 'zod';
import { EducationModel } from '../models/education.js';
import { createCrudRouter } from './crudFactory.js';

const createSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  duration: z.string().min(1),
  details: z.string().min(1),
});

export const educationRouter = createCrudRouter({
  model: EducationModel as any,
  createSchema,
  updateSchema: createSchema.partial(),
});

