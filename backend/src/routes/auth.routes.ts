import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UserModel } from '../models/user.js';
import { ApiError } from '../middleware/apiError.js';
import { signUserToken } from '../utils/auth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  const parsed = loginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', parsed.error.flatten()));
    return;
  }

  try {
    const email = parsed.data.email.toLowerCase();
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      next(new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password'));
      return;
    }

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) {
      next(new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password'));
      return;
    }

    const token = signUserToken({ sub: user._id.toString(), email: user.email });
    res.json({ token, user: { id: user._id.toString(), email: user.email } });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

