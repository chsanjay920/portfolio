import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { CertificateItem } from '../models/portfolio.models';

type CertificateApiDoc = {
  _id: string;
  slug: string;
  title: string;
  issuer: string;
  date: string;
  credentialLink?: string;
  summary: string;
  content: string;
  imageFileId?: string;
};

@Injectable({ providedIn: 'root' })
export class CertificatesApi {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<CertificateItem[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: CertificateApiDoc[] }>(`${environment.apiBaseUrl}/certificates`),
    );

    return res.items.map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      content: c.content,
      date: c.date,
      tags: [c.issuer].filter(Boolean),
      image: c.imageFileId ? `${environment.apiBaseUrl}/files/${c.imageFileId}` : undefined,
      links: c.credentialLink ? [{ label: 'Credential', href: c.credentialLink }] : [],
    }));
  }

  async getBySlug(slug: string): Promise<CertificateItem | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ item: CertificateApiDoc }>(
          `${environment.apiBaseUrl}/certificates/slug/${encodeURIComponent(slug)}`,
        ),
      );

      const c = res.item;
      return {
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        content: c.content,
        date: c.date,
        tags: [c.issuer].filter(Boolean),
        image: c.imageFileId ? `${environment.apiBaseUrl}/files/${c.imageFileId}` : undefined,
        links: c.credentialLink ? [{ label: 'Credential', href: c.credentialLink }] : [],
      };
    } catch {
      return null;
    }
  }
}

