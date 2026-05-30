import mongoose, { Schema, Types } from 'mongoose';

export interface ProjectIdeaDoc {
  slug: string;
  title: string;
  summary: string;
  content: string;
  resources: { label: string; href: string }[];
  imageFileId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<{ label: string; href: string }>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const projectIdeaSchema = new Schema<ProjectIdeaDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    resources: { type: [linkSchema], required: true, default: [] },
    imageFileId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true, collection: 'projectIdeas' },
);

projectIdeaSchema.index({ title: 'text', summary: 'text', content: 'text' });

export const ProjectIdeaModel = mongoose.model<ProjectIdeaDoc>('ProjectIdea', projectIdeaSchema);

