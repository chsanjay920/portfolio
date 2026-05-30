import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ProjectItem } from '../models/portfolio.models';

type ProjectIdeaApiDoc = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  resources: { label: string; href: string }[];
  imageFileId?: string;
};

@Injectable({ providedIn: 'root' })
export class ProjectIdeasApi {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<ProjectItem[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: ProjectIdeaApiDoc[] }>(`${environment.apiBaseUrl}/projectIdeas`),
    );

    return res.items.map((i) => ({
      slug: i.slug,
      title: i.title,
      summary: i.summary,
      content: i.content,
      tags: [],
      image: i.imageFileId ? `${environment.apiBaseUrl}/files/${i.imageFileId}` : undefined,
      links: i.resources ?? [],
    }));
  }

  async getBySlug(slug: string): Promise<ProjectItem | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ item: ProjectIdeaApiDoc }>(
          `${environment.apiBaseUrl}/projectIdeas/slug/${encodeURIComponent(slug)}`,
        ),
      );
      const i = res.item;
      return {
        slug: i.slug,
        title: i.title,
        summary: i.summary,
        content: i.content,
        tags: [],
        image: i.imageFileId ? `${environment.apiBaseUrl}/files/${i.imageFileId}` : undefined,
        links: i.resources ?? [],
      };
    } catch {
      return null;
    }
  }
}

