import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectToMongo() {
  if (isConnected) return;

  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DBNAME,
  });

  isConnected = true;
}

