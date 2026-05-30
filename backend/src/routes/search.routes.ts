import { Router } from 'express';
import { z } from 'zod';
import { BlogModel } from '../models/blog.js';
import { ProjectModel } from '../models/project.js';
import { ProjectIdeaModel } from '../models/projectIdea.js';
import { CertificateModel } from '../models/certificate.js';
import { ExperienceModel } from '../models/experience.js';
import { EducationModel } from '../models/education.js';

type SearchCategory =
  | 'Blogs'
  | 'Projects'
  | 'Project Ideas'
  | 'Certificates'
  | 'Experience'
  | 'Education';

type SearchResultItem = {
  category: SearchCategory;
  title: string;
  route: string;
  slug: string;
  snippet: string;
  date?: string;
  score: number;
};

type SearchResultGroup = { category: SearchCategory; results: SearchResultItem[] };

function clamp(text: string, max = 180): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

export const searchRouter = Router();

searchRouter.get('/', async (req, res, next) => {
  try {
    const q = z.string().default('').parse(req.query.q).trim();
    if (q.length < 2) {
      res.json({ groups: [] satisfies SearchResultGroup[] });
      return;
    }

    const [blogs, projects, ideas, certificates, experience, education] = await Promise.all([
      BlogModel.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(6)
        .lean()
        .exec(),
      ProjectModel.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(6)
        .lean()
        .exec(),
      ProjectIdeaModel.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(6)
        .lean()
        .exec(),
      CertificateModel.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(6)
        .lean()
        .exec(),
      ExperienceModel.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(6)
        .lean()
        .exec(),
      EducationModel.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(6)
        .lean()
        .exec(),
    ]);

    const groups: SearchResultGroup[] = [];

    if (blogs.length) {
      groups.push({
        category: 'Blogs',
        results: blogs.map((b: any) => ({
          category: 'Blogs',
          title: b.title,
          slug: b.slug,
          route: `/blogs/${b.slug}`,
          snippet: clamp([b.summary, (b.tags ?? []).join(' ')].join(' ')),
          date: b.publishDate,
          score: Number(b.score ?? 0),
        })),
      });
    }

    if (projects.length) {
      groups.push({
        category: 'Projects',
        results: projects.map((p: any) => ({
          category: 'Projects',
          title: p.title,
          slug: p.slug,
          route: `/projects/${p.slug}`,
          snippet: clamp([p.description, (p.techStack ?? []).join(' ')].join(' ')),
          score: Number(p.score ?? 0),
        })),
      });
    }

    if (ideas.length) {
      groups.push({
        category: 'Project Ideas',
        results: ideas.map((i: any) => ({
          category: 'Project Ideas',
          title: i.title,
          slug: i.slug,
          route: `/project-ideas/${i.slug}`,
          snippet: clamp(i.concept ?? ''),
          score: Number(i.score ?? 0),
        })),
      });
    }

    if (certificates.length) {
      groups.push({
        category: 'Certificates',
        results: certificates.map((c: any) => ({
          category: 'Certificates',
          title: c.title,
          slug: c.slug,
          route: `/certificates/${c.slug}`,
          snippet: clamp([c.issuer, c.description].filter(Boolean).join(' ')),
          date: c.date,
          score: Number(c.score ?? 0),
        })),
      });
    }

    if (experience.length) {
      groups.push({
        category: 'Experience',
        results: experience.map((e: any) => ({
          category: 'Experience',
          title: e.role,
          slug: e._id.toString(),
          route: `/experience#${encodeURIComponent(e._id.toString())}`,
          snippet: clamp([e.company, e.description].filter(Boolean).join(' ')),
          date: e.duration,
          score: Number(e.score ?? 0),
        })),
      });
    }

    if (education.length) {
      groups.push({
        category: 'Education',
        results: education.map((e: any) => ({
          category: 'Education',
          title: e.degree,
          slug: e._id.toString(),
          route: `/education#${encodeURIComponent(e._id.toString())}`,
          snippet: clamp([e.institution, e.details].filter(Boolean).join(' ')),
          date: e.duration,
          score: Number(e.score ?? 0),
        })),
      });
    }

    res.json({ groups });
  } catch (err) {
    next(err);
  }
});

