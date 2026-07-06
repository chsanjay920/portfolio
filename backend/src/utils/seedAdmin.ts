import bcrypt from 'bcrypt';
import { env } from './env.js';
import { UserModel } from '../models/user.js';

async function upsertAdminUser() {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  await UserModel.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // eslint-disable-next-line no-console
  console.log(`[portfolio-api] admin ready: ${email}`);
}

export async function seedAdminIfNeeded() {
  const count = await UserModel.estimatedDocumentCount();
  if (count === 0) {
    await upsertAdminUser();
    return;
  }

  if (env.NODE_ENV === 'development') {
    await upsertAdminUser();
  }
}
