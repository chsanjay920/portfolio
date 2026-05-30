import mongoose, { Schema } from 'mongoose';

export interface UserDoc {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, collection: 'users' },
);

export const UserModel = mongoose.model<UserDoc>('User', userSchema);

