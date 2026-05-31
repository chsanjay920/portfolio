import { connectToMongo } from '../src/utils/mongo.js';
import { seedAdminIfNeeded } from '../src/utils/seedAdmin.js';
import { createApp } from '../src/app.js';

// Ensure MongoDB is connected before handling requests.
// Vercel may reuse the same function instance between invocations.
await connectToMongo();
await seedAdminIfNeeded();

const app = createApp();
export default app;
