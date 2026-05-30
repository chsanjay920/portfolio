import { Types } from 'mongoose';

export function oidToString(id: unknown): string | undefined {
  if (!id) return undefined;
  if (typeof id === 'string') return id;
  if (id instanceof Types.ObjectId) return id.toString();
  // mongodb ObjectId has toString()
  if (typeof (id as any).toString === 'function') return (id as any).toString();
  return undefined;
}

export function mapFileIds<T extends Record<string, any>>(doc: T | null, fields: string[]): T | null {
  if (!doc) return doc;
  const out: any = { ...doc };
  for (const f of fields) {
    if (Array.isArray(out[f])) {
      out[f] = out[f].map((x: any) => oidToString(x)).filter(Boolean);
    } else {
      out[f] = oidToString(out[f]);
    }
  }
  return out;
}

