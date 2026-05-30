import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import type { LoginResponse } from './auth.types';

const TOKEN_KEY = 'portfolio_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSig = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly token = computed(() => this.tokenSig());
  readonly isAuthenticated = computed(() => Boolean(this.tokenSig()));

  constructor(private readonly http: HttpClient) {}

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password }),
    );
    localStorage.setItem(TOKEN_KEY, res.token);
    this.tokenSig.set(res.token);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSig.set(null);
  }
}

