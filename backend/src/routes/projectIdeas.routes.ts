import { z } from 'zod';
import multer from 'multer';
import { ProjectIdeaModel } from '../models/projectIdea.js';
import { createCrudRouter } from './crudFactory.js';
import { slugify } from '../utils/slug.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/apiError.js';
import { uploadBufferToR2 } from '../utils/r2.js';
import { mapFileIds } from '../utils/json.js';

const createSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  resources: z.array(z.object({ label: z.string().min(1), href: z.string().url() })).default([]),
  imageFileId: z.string().min(24).optional(),
});

const updateSchema = createSchema.partial();

export const projectIdeasRouter = createCrudRouter({
  model: ProjectIdeaModel as any,
  createSchema: createSchema.transform((d) => ({
    ...d,
    slug: (d.slug ?? slugify(d.title)).toLowerCase(),
  })),
  updateSchema,
  slugField: 'slug',
  mapItem: (x) => mapFileIds(x, ['imageFileId']),
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

projectIdeasRouter.post('/:id/image', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Missing file'));
      return;
    }

    const fileId = await uploadBufferToR2({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      buffer: req.file.buffer,
    });

    const item = await ProjectIdeaModel.findByIdAndUpdate(
      req.params.id,
      { $set: { imageFileId: fileId } },
      { new: true },
    )
      .lean()
      .exec();

    if (!item) {
      next(new ApiError(404, 'NOT_FOUND', 'Item not found'));
      return;
    }

    res.json({ item: mapFileIds(item as any, ['imageFileId']), fileId: fileId.toString() });
  } catch (err) {
    next(err);
  }
});

