import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { EducationItem } from '../models/portfolio.models';

type EducationApiDoc = {
  _id: string;
  degree: string;
  institution: string;
  duration: string;
  details: string;
};

@Injectable({ providedIn: 'root' })
export class EducationApi {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<EducationItem[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: EducationApiDoc[] }>(`${environment.apiBaseUrl}/education`),
    );

    return res.items.map((e) => ({
      id: e._id,
      title: e.degree,
      institution: e.institution,
      start: e.duration,
      end: '',
      description: e.details,
    }));
  }
}

