import type {
  BlogPost,
  CertificateItem,
  EducationItem,
  ExperienceItem,
  ProfileData,
  ProjectItem,
} from '../models/portfolio.models';

export const profile: ProfileData = {
  fullName: 'Jeslur Rahman',
  title: 'Software Engineer || AI Enthusiast || Tutor || Blogger || Freelancer',
  bio: 'Hi! A dedicated Full-Stack Software Engineer with over a year of hands-on experience, holding a BSc (Hons) in Information Technology from the prestigious University of Sri Lanka Institute of Information Technology (SLIIT). Bringing a robust foundation in Software Engineering and Artificial Intelligence (AI), complemented by practical professional experience.',
  avatarInitials: 'JR',
  avatarAlt: 'Profile avatar',
  avatarImage: 'assets/content-fallback.svg',
  socialLinks: [
    { platform: 'Email', label: 'Email', href: 'mailto:you@example.com' },
    { platform: 'LinkedIn', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { platform: 'GitHub', label: 'GitHub', href: 'https://github.com/' },
    { platform: 'Twitter', label: 'Twitter/X', href: 'https://x.com/' },
  ],
  // Replace this with your real resume file/URL.
  resumeUrl: 'assets/resume.pdf',
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-a-medium-like-angular-layout',
    title: 'Building a Medium-like Angular Layout',
    summary: 'A clean approach to typography, spacing, and article rendering for a modern reading experience.',
    date: '2026-03-01',
    tags: ['Angular', 'UI/UX', 'SCSS'],
    image: 'assets/content-fallback.svg',
    content: `
## Why a Medium-like UI?

Readability wins. A calm layout, predictable spacing, and strong type scale make your content feel effortless.

## Layout principles

- Keep a comfortable max-width.
- Use generous line-height and subtle borders.
- Prefer minimal accents over heavy colors.

## Rendering article content

You can store content in Markdown and render it into sanitized HTML.

\`\`\`
title -> slug -> detail route
\`\`\`

> Tip: use sanitization for safety when rendering Markdown.
`,
  },
  {
    slug: 'search-that-feels-instant',
    title: 'Search That Feels Instant',
    summary: 'Global search across blogs, projects, ideas, and certificates—categorized and route-aware.',
    date: '2026-02-11',
    tags: ['Search', 'Routing', 'TypeScript'],
    image: 'assets/content-fallback.svg',
    content: `
## The goal

When someone searches, the UI should respond quickly and help them find the right page.

## Categorized results

Group results by content type (Blog, Project, Certificate, etc.) so users can choose fast.

## Navigate to detail pages

Each result includes a route and slug—so clicking takes you directly to the relevant detail page.
`,
  },
  {
    slug: 'component-design-for-portfolios',
    title: 'Component Design for Portfolios',
    summary: 'Reusable cards, tag pills, section headers, and details pages that scale as content grows.',
    date: '2026-01-20',
    tags: ['Design Systems', 'Components'],
    image: 'assets/content-fallback.svg',
    content: `
## Reusability beats repetition

Create small UI primitives and compose them.

## A practical component set

- Card components for lists
- Tag pills
- Section headers
- Markdown/HTML renderer
`,
  },
];

export const projects: ProjectItem[] = [
  {
    slug: 'clean-reads',
    title: 'Clean Reads',
    summary: 'A minimal reading experience with fast navigation, clean typography, and content-first layouts.',
    content: 'A minimal reading experience with fast navigation, clean typography, and content-first layouts.',
    date: '2025-12-03',
    tags: ['Angular', 'UI/UX', 'Accessibility'],
    image: 'assets/content-fallback.svg',
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Demo', href: 'https://example.com/' },
    ],
  },
  {
    slug: 'ai-notes-workbench',
    title: 'AI Notes Workbench',
    summary: 'An AI-assisted note editor that organizes ideas into structured summaries and tasks.',
    content: 'An AI-assisted note editor that organizes ideas into structured summaries and tasks.',
    date: '2025-10-18',
    tags: ['AI', 'TypeScript', 'UX'],
    image: 'assets/content-fallback.svg',
    links: [{ label: 'GitHub', href: 'https://github.com/' }],
  },
];

export const projectIdeas: ProjectItem[] = [
  {
    slug: 'medium-lite',
    title: 'Medium Lite',
    summary: 'A lightweight blogging client with offline-friendly reading, drafts, and tags.',
    content: 'A lightweight blogging client with offline-friendly reading, drafts, and tags.',
    tags: ['Writing', 'UX', 'PWA'],
    links: [{ label: 'GitHub (idea)', href: 'https://github.com/' }],
  },
  {
    slug: 'dev-portfolio-generator',
    title: 'Dev Portfolio Generator',
    summary: 'Turn a JSON profile into a static, high-quality portfolio with a consistent design system.',
    content: 'Turn a JSON profile into a static, high-quality portfolio with a consistent design system.',
    tags: ['Generators', 'Templates', 'Angular'],
    links: [{ label: 'Demo idea', href: 'https://example.com/' }],
  },
];

export const certificates: CertificateItem[] = [
  {
    slug: 'aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner',
    summary: 'Cloud fundamentals covering AWS services, security, and billing concepts.',
    content: 'Cloud fundamentals covering AWS services, security, and billing concepts.',
    date: '2025-09-15',
    tags: ['AWS', 'Cloud'],
    image: 'assets/content-fallback.svg',
    links: [{ label: 'Certificate', href: 'https://example.com/' }],
  },
  {
    slug: 'angular-fundamentals',
    title: 'Angular Fundamentals (Course)',
    summary: 'Modern Angular concepts: components, services, routing, and building maintainable UI.',
    content: 'Modern Angular concepts: components, services, routing, and building maintainable UI.',
    date: '2025-06-30',
    tags: ['Angular'],
    image: 'assets/content-fallback.svg',
    links: [{ label: 'Course', href: 'https://example.com/' }],
  },
];

export const experience: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Frontend Developer',
    organization: 'Acme Studio',
    start: '2024-05-01',
    end: 'Present',
    description: `
Built and maintained responsive Angular features with a focus on UI consistency and performance.

- Implemented reusable components and routing patterns
- Improved readability with Medium-inspired typography
- Partnered with design to refine interaction details
`,
  },
  {
    id: 'exp-2',
    title: 'Web Developer',
    organization: 'Northwind Labs',
    start: '2022-09-01',
    end: '2024-04-30',
    description: `
Delivered production web features with a clean and maintainable codebase.

- Built dashboards and data views
- Added search-friendly navigation patterns
- Maintained component libraries
`,
  },
];

export const education: EducationItem[] = [
  {
    id: 'edu-1',
    title: 'B.Sc. Computer Science',
    institution: 'State University',
    start: '2018-08-01',
    end: '2022-05-31',
    description: `
Core CS coursework and projects focused on software engineering fundamentals.
`,
  },
  {
    id: 'edu-2',
    title: 'UI/UX Design (Specialization)',
    institution: 'Online Program',
    start: '2023-01-01',
    end: '2023-12-15',
    description: `
Learned interaction design, typography, and practical UX workflows for product teams.
`,
  },
];

