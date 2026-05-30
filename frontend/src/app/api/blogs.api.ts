import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { BlogPost } from '../models/portfolio.models';

type BlogApiDoc = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  publishDate: string;
  tags: string[];
  content: string;
  bannerFileId?: string;
};

@Injectable({ providedIn: 'root' })
export class BlogsApi {
  constructor(private readonly http: HttpClient) {}

  async list(opts?: { q?: string; tag?: string }): Promise<BlogPost[]> {
    let params = new HttpParams();
    if (opts?.q) params = params.set('q', opts.q);
    if (opts?.tag) params = params.set('tag', opts.tag);

    const res = await firstValueFrom(
      this.http.get<{ items: Array<Omit<BlogApiDoc, 'content'> & { content?: never }> }>(
        `${environment.apiBaseUrl}/blogs`,
        { params },
      ),
    );

    return res.items.map((b) => ({
      slug: b.slug,
      title: b.title,
      summary: b.summary,
      date: b.publishDate,
      tags: b.tags ?? [],
      image: b.bannerFileId ? `${environment.apiBaseUrl}/files/${b.bannerFileId}` : undefined,
      content: '',
    }));
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ blog: BlogApiDoc }>(`${environment.apiBaseUrl}/blogs/${encodeURIComponent(slug)}`),
      );
      const b = res.blog;
      return {
        slug: b.slug,
        title: b.title,
        summary: b.summary,
        date: b.publishDate,
        tags: b.tags ?? [],
        image: b.bannerFileId ? `${environment.apiBaseUrl}/files/${b.bannerFileId}` : undefined,
        content: b.content,
      };
    } catch {
      return null;
    }
  }
}

