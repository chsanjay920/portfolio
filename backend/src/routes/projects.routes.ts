import { z } from 'zod';
import multer from 'multer';
import { ProjectModel } from '../models/project.js';
import { createCrudRouter } from './crudFactory.js';
import { slugify } from '../utils/slug.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/apiError.js';
import { uploadBufferToGridFS } from '../utils/gridfs.js';
import { mapFileIds } from '../utils/json.js';

const createSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  techStack: z.array(z.string().min(1)).default([]),
  links: z.array(z.object({ label: z.string().min(1), href: z.string().url() })).default([]),
  imageFileIds: z.array(z.string().min(24)).default([]),
});

const updateSchema = createSchema.partial();

export const projectsRouter = createCrudRouter({
  model: ProjectModel as any,
  createSchema: createSchema.transform((d) => ({
    ...d,
    slug: (d.slug ?? slugify(d.title)).toLowerCase(),
  })),
  updateSchema,
  slugField: 'slug',
  mapItem: (x) => mapFileIds(x, ['imageFileIds']),
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

projectsRouter.post('/:id/images', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Missing file'));
      return;
    }

    const fileId = await uploadBufferToGridFS({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      buffer: req.file.buffer,
    });

    const item = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { $push: { imageFileIds: fileId } },
      { new: true },
    )
      .lean()
      .exec();

    if (!item) {
      next(new ApiError(404, 'NOT_FOUND', 'Item not found'));
      return;
    }

    res.json({ item: mapFileIds(item as any, ['imageFileIds']), fileId: fileId.toString() });
  } catch (err) {
    next(err);
  }
});

