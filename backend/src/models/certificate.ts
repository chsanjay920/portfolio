import mongoose, { Schema, Types } from 'mongoose';

export interface CertificateDoc {
  slug: string;
  title: string;
  issuer: string;
  date: string; // ISO or display string
  credentialLink?: string;
  summary: string;
  content: string;
  imageFileId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<CertificateDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    credentialLink: { type: String, required: false },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    imageFileId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true, collection: 'certificates' },
);

certificateSchema.index({ title: 'text', issuer: 'text', summary: 'text', content: 'text' });

export const CertificateModel = mongoose.model<CertificateDoc>('Certificate', certificateSchema);

