import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ExperienceItem } from '../models/portfolio.models';

type ExperienceApiDoc = {
  _id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

@Injectable({ providedIn: 'root' })
export class ExperienceApi {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<ExperienceItem[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: ExperienceApiDoc[] }>(`${environment.apiBaseUrl}/experience`),
    );

    return res.items.map((e) => ({
      id: e._id,
      title: e.role,
      organization: e.company,
      start: e.duration,
      end: '',
      description: e.description,
    }));
  }
}

