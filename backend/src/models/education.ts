import mongoose, { Schema } from 'mongoose';

export interface EducationDoc {
  degree: string;
  institution: string;
  duration: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<EducationDoc>(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    duration: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true, collection: 'education' },
);

educationSchema.index({ degree: 'text', institution: 'text', details: 'text' });

export const EducationModel = mongoose.model<EducationDoc>('Education', educationSchema);

