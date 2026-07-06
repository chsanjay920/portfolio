import { Readable } from 'node:stream';
import { Router } from 'express';
import { ApiError } from '../middleware/apiError.js';
import { getR2ObjectMeta, getR2ObjectStream } from '../utils/r2.js';

export const filesRouter = Router();

filesRouter.get('/:fileId', async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    if (!/^[a-f0-9]{24}$/i.test(fileId)) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid fileId'));
      return;
    }

    let meta: { contentType?: string; contentLength?: number };
    try {
      meta = await getR2ObjectMeta(fileId);
    } catch {
      next(new ApiError(404, 'NOT_FOUND', 'File not found'));
      return;
    }

    const object = await getR2ObjectStream(fileId);
    if (!object.Body) {
      next(new ApiError(404, 'NOT_FOUND', 'File not found'));
      return;
    }

    if (meta.contentType) res.setHeader('content-type', meta.contentType);
    if (meta.contentLength) res.setHeader('content-length', String(meta.contentLength));

    const body = object.Body;
    if (body instanceof Readable) {
      body.pipe(res);
      return;
    }

    const bytes = await body.transformToByteArray();
    res.send(Buffer.from(bytes));
  } catch (err) {
    next(err);
  }
});
