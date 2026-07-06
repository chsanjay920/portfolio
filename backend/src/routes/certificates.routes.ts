import { z } from 'zod';
import multer from 'multer';
import { CertificateModel } from '../models/certificate.js';
import { createCrudRouter } from './crudFactory.js';
import { slugify } from '../utils/slug.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/apiError.js';
import { uploadBufferToR2 } from '../utils/r2.js';
import { mapFileIds } from '../utils/json.js';

const createSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  credentialLink: z.string().url().optional(),
  summary: z.string().min(1),
  content: z.string().min(1),
  imageFileId: z.string().min(24).optional(),
});

export const certificatesRouter = createCrudRouter({
  model: CertificateModel as any,
  createSchema: createSchema.transform((d) => ({
    ...d,
    slug: (d.slug ?? slugify(d.title)).toLowerCase(),
  })),
  updateSchema: createSchema.partial(),
  slugField: 'slug',
  mapItem: (x) => mapFileIds(x, ['imageFileId']),
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

certificatesRouter.post('/:id/image', requireAuth, upload.single('file'), async (req, res, next) => {
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

    const item = await CertificateModel.findByIdAndUpdate(
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

