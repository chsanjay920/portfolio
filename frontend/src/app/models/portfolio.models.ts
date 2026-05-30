export type SocialPlatform = 'LinkedIn' | 'GitHub' | 'Twitter' | 'Email' | 'Website' | 'Other';

export interface SocialLink {
  platform: SocialPlatform | string;
  label: string;
  href: string;
}

export interface ProfileData {
  fullName: string;
  title: string;
  bio: string;
  avatarInitials: string;
  avatarImage?: string;
  avatarAlt: string;
  socialLinks: SocialLink[];
  resumeUrl: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO: YYYY-MM-DD
  tags: string[];
  image?: string; // path under /assets
  content: string; // Markdown
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown
  date?: string; // ISO
  tags: string[];
  image?: string; // path under /assets
  links: LinkItem[];
}

export interface CertificateItem {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string; // ISO
  tags: string[];
  image?: string; // path under /assets
  links: LinkItem[];
}

export interface ExperienceItem {
  id: string;
  title: string; // Role
  organization: string;
  start: string; // ISO or "Month YYYY"
  end: string; // ISO or "Present"
  description: string; // Markdown or plain text
}

export interface EducationItem {
  id: string;
  title: string; // Degree
  institution: string;
  start: string; // ISO or "Month YYYY"
  end: string; // ISO or "Present"
  description: string; // Markdown or plain text
}

