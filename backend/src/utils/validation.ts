import { z } from 'zod';

export function normalizeUrl(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const urlString = z.preprocess(normalizeUrl, z.string().url());

export const optionalUrlString = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return normalizeUrl(trimmed);
}, z.string().url().optional());
