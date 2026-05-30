import { Router } from 'express';
import { ApiError } from '../middleware/apiError.js';
import { getUploadsBucket, parseObjectId } from '../utils/gridfs.js';

export const filesRouter = Router();

filesRouter.get('/:fileId', async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    if (!/^[a-f0-9]{24}$/i.test(fileId)) {
      next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid fileId'));
      return;
    }

    const bucket = getUploadsBucket();
    const id = parseObjectId(fileId);

    const files = await bucket.find({ _id: id }).toArray();
    if (!files.length) {
      next(new ApiError(404, 'NOT_FOUND', 'File not found'));
      return;
    }

    const file = files[0];
    if (file.contentType) res.setHeader('content-type', file.contentType);
    res.setHeader('content-length', String(file.length));

    bucket.openDownloadStream(id).pipe(res);
  } catch (err) {
    next(err);
  }
});

