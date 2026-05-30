import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { SearchResultGroup } from './search.types';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private readonly http: HttpClient) {}

  async search(query: string): Promise<SearchResultGroup[]> {
    const q = query.trim();
    if (q.length < 2) return [];

    try {
      const res = await firstValueFrom(
        this.http.get<{ groups: SearchResultGroup[] }>(`${environment.apiBaseUrl}/search`, { params: { q } }),
      );
      return res.groups ?? [];
    } catch {
      return [];
    }
  }
}

