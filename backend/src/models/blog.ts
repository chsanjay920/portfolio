import mongoose, { Schema, Types } from 'mongoose';

export interface BlogDoc {
  slug: string;
  title: string;
  summary: string;
  publishDate: string; // ISO YYYY-MM-DD
  tags: string[];
  content: string; // Markdown
  bannerFileId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<BlogDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    publishDate: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    content: { type: String, required: true },
    bannerFileId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true, collection: 'blogs' },
);

blogSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

export const BlogModel = mongoose.model<BlogDoc>('Blog', blogSchema);

