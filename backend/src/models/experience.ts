import mongoose, { Schema } from 'mongoose';

export interface ExperienceDoc {
  role: string;
  company: string;
  duration: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<ExperienceDoc>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true, collection: 'experience' },
);

experienceSchema.index({ role: 'text', company: 'text', description: 'text' });

export const ExperienceModel = mongoose.model<ExperienceDoc>('Experience', experienceSchema);

