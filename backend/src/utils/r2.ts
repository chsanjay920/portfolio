import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ObjectId } from 'mongodb';
import { env } from './env.js';

let client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
}

export async function uploadBufferToR2(opts: {
  filename: string;
  contentType?: string;
  buffer: Buffer;
}): Promise<string> {
  const key = new ObjectId().toString();
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: opts.buffer,
      ContentType: opts.contentType ?? 'application/octet-stream',
      Metadata: { originalFilename: opts.filename },
    }),
  );
  return key;
}

export async function getR2ObjectMeta(key: string): Promise<{ contentType?: string; contentLength?: number }> {
  const head = await getR2Client().send(
    new HeadObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
  return {
    contentType: head.ContentType,
    contentLength: head.ContentLength,
  };
}

export async function getR2ObjectStream(key: string) {
  const result = await getR2Client().send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
  return result;
}

export function parseObjectId(input: string): ObjectId {
  return new ObjectId(input);
}
