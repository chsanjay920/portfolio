import { Router } from 'express';
import { z, type ZodTypeAny } from 'zod';
import { ApiError } from '../middleware/apiError.js';
import { requireAuth } from '../middleware/requireAuth.js';

type AnyModel = {
  find: (filter?: unknown) => { lean: () => { exec: () => Promise<unknown[]> } };
  findOne: (filter?: unknown) => { lean: () => { exec: () => Promise<unknown | null> } };
  findById: (id: string) => { lean: () => { exec: () => Promise<unknown | null> } };
  create: (doc: unknown) => Promise<unknown>;
  findByIdAndUpdate: (
    id: string,
    update: unknown,
    opts: unknown,
  ) => { lean: () => { exec: () => Promise<unknown | null> } };
  findByIdAndDelete: (id: string) => { lean: () => { exec: () => Promise<unknown | null> } };
};

export function createCrudRouter(opts: {
  model: AnyModel;
  createSchema: ZodTypeAny;
  updateSchema: ZodTypeAny;
  listSort?: Record<string, 1 | -1>;
  slugField?: string;
  mapItem?: (item: any) => any;
}) {
  const router = Router();
  const mapOne = (x: any) => (opts.mapItem ? opts.mapItem(x) : x);

  router.get('/', async (_req, res, next) => {
    try {
      const items = await opts.model.find({}).lean().exec();
      res.json({ items: items.map(mapOne) });
    } catch (err) {
      next(err);
    }
  });

  if (opts.slugField) {
    router.get('/slug/:slug', async (req, res, next) => {
      try {
        const slug = req.params.slug.toLowerCase();
        const item = await opts.model.findOne({ [opts.slugField as string]: slug }).lean().exec();
        if (!item) {
          next(new ApiError(404, 'NOT_FOUND', 'Item not found'));
          return;
        }
        res.json({ item: mapOne(item) });
      } catch (err) {
        next(err);
      }
    });
  }

  router.get('/:id', async (req, res, next) => {
    try {
      const item = await opts.model.findById(req.params.id).lean().exec();
      if (!item) {
        next(new ApiError(404, 'NOT_FOUND', 'Item not found'));
        return;
      }
      res.json({ item: mapOne(item) });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', requireAuth, async (req, res, next) => {
    const parsed = opts.createSchema.safeParse(req.body);
    if (!parsed.success) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
      return;
    }

    try {
      const created = await opts.model.create(parsed.data);
      res.status(201).json({ item: mapOne(created) });
    } catch (err) {
      next(err);
    }
  });

  router.put('/:id', requireAuth, async (req, res, next) => {
    const parsed = opts.updateSchema.safeParse(req.body);
    if (!parsed.success) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
      return;
    }

    try {
      const item = await opts.model
        .findByIdAndUpdate(req.params.id, { $set: parsed.data }, { new: true })
        .lean()
        .exec();
      if (!item) {
        next(new ApiError(404, 'NOT_FOUND', 'Item not found'));
        return;
      }
      res.json({ item: mapOne(item) });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const item = await opts.model.findByIdAndDelete(req.params.id).lean().exec();
      if (!item) {
        next(new ApiError(404, 'NOT_FOUND', 'Item not found'));
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

