import bcrypt from 'bcrypt';
import { env } from './env.js';
import { UserModel } from '../models/user.js';

/**
 * ADMIN_EMAIL and ADMIN_PASSWORD are the source of truth, including on Vercel.
 * Production used to skip this once any user existed, so env changes never
 * reached MongoDB and login kept failing with the old password.
 */
async function syncAdminUser() {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  const updated = await UserModel.findOneAndUpdate(
    { email },
    { $set: { passwordHash } },
  ).exec();
  if (updated) {
    // eslint-disable-next-line no-console
    console.log(`[portfolio-api] admin ready: ${email}`);
    return;
  }

  const existing = await UserModel.find().sort({ createdAt: 1 }).limit(2).exec();
  if (existing.length === 1) {
    existing[0].email = email;
    existing[0].passwordHash = passwordHash;
    await existing[0].save();
    // eslint-disable-next-line no-console
    console.log(`[portfolio-api] admin ready: ${email}`);
    return;
  }

  await UserModel.create({ email, passwordHash });
  // eslint-disable-next-line no-console
  console.log(`[portfolio-api] admin ready: ${email}`);
}

export async function seedAdminIfNeeded() {
  await syncAdminUser();
}
