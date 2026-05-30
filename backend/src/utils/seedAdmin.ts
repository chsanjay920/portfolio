import bcrypt from 'bcrypt';
import { env } from './env.js';
import { UserModel } from '../models/user.js';

export async function seedAdminIfNeeded() {
  const count = await UserModel.estimatedDocumentCount();
  if (count > 0) return;

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await UserModel.create({
    email: env.ADMIN_EMAIL,
    passwordHash,
  });

  // eslint-disable-next-line no-console
  console.log(`[portfolio-api] seeded admin user: ${env.ADMIN_EMAIL}`);
}

