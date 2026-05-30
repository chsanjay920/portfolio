import mongoose, { Schema, Types } from 'mongoose';

export interface SocialLink {
  platform: string;
  label: string;
  href: string;
}

export interface ProfileDoc {
  fullName: string;
  title: string;
  bio: string;
  avatarInitials: string;
  avatarAlt: string;
  socialLinks: SocialLink[];
  photoFileId?: Types.ObjectId;
  resumeFileId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema<SocialLink>(
  {
    platform: { type: String, required: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const profileSchema = new Schema<ProfileDoc>(
  {
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    avatarInitials: { type: String, required: true },
    avatarAlt: { type: String, required: true },
    socialLinks: { type: [socialLinkSchema], required: true, default: [] },
    photoFileId: { type: Schema.Types.ObjectId, required: false },
    resumeFileId: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true, collection: 'profile' },
);

export const ProfileModel = mongoose.model<ProfileDoc>('Profile', profileSchema);

