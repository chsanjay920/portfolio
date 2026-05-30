import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { ProfileModel } from '../models/profile.js';
import { ApiError } from '../middleware/apiError.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { uploadBufferToGridFS } from '../utils/gridfs.js';
import { mapFileIds } from '../utils/json.js';

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
});

const upsertProfileSchema = z.object({
  fullName: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  avatarInitials: z.string().min(1),
  avatarAlt: z.string().min(1),
  socialLinks: z.array(socialLinkSchema).default([]),
});

export const profileRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

profileRouter.get('/', async (_req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({}).lean().exec();
    res.json({ profile: mapFileIds(profile as any, ['photoFileId', 'resumeFileId']) });
  } catch (err) {
    next(err);
  }
});

profileRouter.put('/', requireAuth, async (req, res, next) => {
  const parsed = upsertProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
    return;
  }

  try {
    const profile = await ProfileModel.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
      .lean()
      .exec();
    res.json({ profile: mapFileIds(profile as any, ['photoFileId', 'resumeFileId']) });
  } catch (err) {
    next(err);
  }
});

profileRouter.post('/photo', requireAuth, upload.single('file'), async (req, res, next) => {
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

    const profile = await ProfileModel.findOneAndUpdate(
      {},
      { $set: { photoFileId: fileId } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
      .lean()
      .exec();

    res.json({
      profile: mapFileIds(profile as any, ['photoFileId', 'resumeFileId']),
      fileId: fileId.toString(),
    });
  } catch (err) {
    next(err);
  }
});

profileRouter.post('/resume', requireAuth, upload.single('file'), async (req, res, next) => {
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

    const profile = await ProfileModel.findOneAndUpdate(
      {},
      { $set: { resumeFileId: fileId } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
      .lean()
      .exec();

    res.json({
      profile: mapFileIds(profile as any, ['photoFileId', 'resumeFileId']),
      fileId: fileId.toString(),
    });
  } catch (err) {
    next(err);
  }
});

profileRouter.get('/resume', async (_req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({}).lean().exec();
    const resumeFileId = profile?.resumeFileId?.toString();
    if (!resumeFileId) {
      next(new ApiError(404, 'NOT_FOUND', 'Resume not found'));
      return;
    }

    res.redirect(`/api/files/${resumeFileId}`);
  } catch (err) {
    next(err);
  }
});

