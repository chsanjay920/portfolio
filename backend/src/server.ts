import { createApp } from './app.js';
import { env } from './utils/env.js';
import { connectToMongo } from './utils/mongo.js';
import { seedAdminIfNeeded } from './utils/seedAdmin.js';

async function main() {
  await connectToMongo();
  await seedAdminIfNeeded();

  const app = createApp();

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[portfolio-api] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[portfolio-api] fatal startup error', err);
  process.exit(1);
});

