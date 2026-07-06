import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { BlogModel } from '../models/blog.js';
import { ApiError } from '../middleware/apiError.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { slugify } from '../utils/slug.js';
import { uploadBufferToR2 } from '../utils/r2.js';
import { mapFileIds } from '../utils/json.js';
import { handleMongoWriteError } from '../utils/mongoErrors.js';

const blogCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  summary: z.string().min(1),
  publishDate: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  content: z.string().min(1),
});

const blogUpdateSchema = blogCreateSchema.partial().extend({
  slug: z.string().min(1).optional(),
});

export const blogsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

blogsRouter.get('/', async (req, res, next) => {
  try {
    const q = z.string().optional().parse(req.query.q);
    const tag = z.string().optional().parse(req.query.tag);
    const page = z.coerce.number().int().min(1).default(1).parse(req.query.page);
    const limit = z.coerce.number().int().min(1).max(50).default(10).parse(req.query.limit);

    const filter: Record<string, unknown> = {};
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };

    const cursor = BlogModel.find(filter)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select({ content: 0 });

    const [items, total] = await Promise.all([cursor.lean().exec(), BlogModel.countDocuments(filter)]);

    res.json({
      items: items.map((x: any) => mapFileIds(x, ['bannerFileId'])),
      page,
      limit,
      total,
    });
  } catch (err) {
    next(err);
  }
});

blogsRouter.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await BlogModel.findOne({ slug }).lean().exec();
    if (!blog) {
      next(new ApiError(404, 'NOT_FOUND', 'Blog not found'));
      return;
    }
    res.json({ blog: mapFileIds(blog as any, ['bannerFileId']) });
  } catch (err) {
    next(err);
  }
});

blogsRouter.post('/', requireAuth, async (req, res, next) => {
  const parsed = blogCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
    return;
  }

  try {
    const slug = (parsed.data.slug ?? slugify(parsed.data.title)).toLowerCase();
    const created = await BlogModel.create({ ...parsed.data, slug });
    res.status(201).json({ blog: mapFileIds(created.toObject() as any, ['bannerFileId']) });
  } catch (err) {
    if (handleMongoWriteError(err, next)) return;
    next(err);
  }
});

blogsRouter.put('/:id', requireAuth, async (req, res, next) => {
  const parsed = blogUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
    return;
  }

  try {
    const update: Record<string, unknown> = { ...parsed.data };
    if (typeof parsed.data.slug === 'string') update.slug = parsed.data.slug.toLowerCase();

    const blog = await BlogModel.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean().exec();
    if (!blog) {
      next(new ApiError(404, 'NOT_FOUND', 'Blog not found'));
      return;
    }
    res.json({ blog: mapFileIds(blog as any, ['bannerFileId']) });
  } catch (err) {
    if (handleMongoWriteError(err, next)) return;
    next(err);
  }
});

blogsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const blog = await BlogModel.findByIdAndDelete(req.params.id).lean().exec();
    if (!blog) {
      next(new ApiError(404, 'NOT_FOUND', 'Blog not found'));
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

blogsRouter.post('/:id/banner', requireAuth, upload.single('file'), async (req, res, next) => {
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

    const blog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      { $set: { bannerFileId: fileId } },
      { new: true },
    )
      .lean()
      .exec();

    if (!blog) {
      next(new ApiError(404, 'NOT_FOUND', 'Blog not found'));
      return;
    }

    res.json({ blog: mapFileIds(blog as any, ['bannerFileId']), fileId: fileId.toString() });
  } catch (err) {
    next(err);
  }
});

