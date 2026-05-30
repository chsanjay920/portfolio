import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ProjectItem } from '../models/portfolio.models';

type ProjectApiDoc = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  techStack: string[];
  links: { label: string; href: string }[];
  imageFileIds: string[];
};

@Injectable({ providedIn: 'root' })
export class ProjectsApi {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<ProjectItem[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: ProjectApiDoc[] }>(`${environment.apiBaseUrl}/projects`),
    );

    return res.items.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      content: p.content,
      tags: p.techStack ?? [],
      image: p.imageFileIds?.[0] ? `${environment.apiBaseUrl}/files/${p.imageFileIds[0]}` : undefined,
      links: p.links ?? [],
    }));
  }

  async getBySlug(slug: string): Promise<ProjectItem | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ item: ProjectApiDoc }>(
          `${environment.apiBaseUrl}/projects/slug/${encodeURIComponent(slug)}`,
        ),
      );
      const p = res.item;
      return {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        content: p.content,
        tags: p.techStack ?? [],
        image: p.imageFileIds?.[0] ? `${environment.apiBaseUrl}/files/${p.imageFileIds[0]}` : undefined,
        links: p.links ?? [],
      };
    } catch {
      return null;
    }
  }
}

