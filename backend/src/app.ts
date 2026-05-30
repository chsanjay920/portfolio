import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './utils/env.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { profileRouter } from './routes/profile.routes.js';
import { blogsRouter } from './routes/blogs.routes.js';
import { projectsRouter } from './routes/projects.routes.js';
import { projectIdeasRouter } from './routes/projectIdeas.routes.js';
import { experienceRouter } from './routes/experience.routes.js';
import { educationRouter } from './routes/education.routes.js';
import { certificatesRouter } from './routes/certificates.routes.js';
import { filesRouter } from './routes/files.routes.js';
import { searchRouter } from './routes/search.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/blogs', blogsRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/projectIdeas', projectIdeasRouter);
  app.use('/api/experience', experienceRouter);
  app.use('/api/education', educationRouter);
  app.use('/api/certificates', certificatesRouter);
  app.use('/api/files', filesRouter);
  app.use('/api/search', searchRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

