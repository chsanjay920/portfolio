import mongoose, { Schema, Types } from 'mongoose';

export interface LinkItem {
  label: string;
  href: string;
}

export interface ProjectDoc {
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown
  techStack: string[];
  links: LinkItem[];
  imageFileIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const linkItemSchema = new Schema<LinkItem>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const projectSchema = new Schema<ProjectDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    techStack: { type: [String], required: true, default: [] },
    links: { type: [linkItemSchema], required: true, default: [] },
    imageFileIds: { type: [Schema.Types.ObjectId], required: true, default: [] },
  },
  { timestamps: true, collection: 'projects' },
);

projectSchema.index({ title: 'text', summary: 'text', content: 'text', techStack: 'text' });

export const ProjectModel = mongoose.model<ProjectDoc>('Project', projectSchema);

