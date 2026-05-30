import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

let bucket: GridFSBucket | null = null;

export function getUploadsBucket(): GridFSBucket {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB not connected');
  if (!bucket) bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  return bucket;
}

export async function uploadBufferToGridFS(opts: {
  filename: string;
  contentType?: string;
  buffer: Buffer;
}): Promise<ObjectId> {
  const b = getUploadsBucket();
  const uploadStream = b.openUploadStream(opts.filename, {
    contentType: opts.contentType,
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.once('error', reject);
    uploadStream.once('finish', () => resolve());
    uploadStream.end(opts.buffer);
  });

  return uploadStream.id as ObjectId;
}

export function parseObjectId(input: string): ObjectId {
  return new ObjectId(input);
}

