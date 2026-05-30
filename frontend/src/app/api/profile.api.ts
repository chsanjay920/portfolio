import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ProfileData } from '../models/portfolio.models';

type ProfileApiDoc = {
  fullName: string;
  title: string;
  bio: string;
  avatarInitials: string;
  avatarAlt: string;
  socialLinks: { platform: string; label: string; href: string }[];
  photoFileId?: string;
  resumeFileId?: string;
};

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  constructor(private readonly http: HttpClient) {}

  async getProfile(): Promise<ProfileData | null> {
    const res = await firstValueFrom(
      this.http.get<{ profile: ProfileApiDoc | null }>(`${environment.apiBaseUrl}/profile`),
    );
    if (!res.profile) return null;

    const photoUrl = res.profile.photoFileId
      ? `${environment.apiBaseUrl}/files/${res.profile.photoFileId}`
      : undefined;

    return {
      fullName: res.profile.fullName,
      title: res.profile.title,
      bio: res.profile.bio,
      avatarInitials: res.profile.avatarInitials,
      avatarAlt: res.profile.avatarAlt,
      avatarImage: photoUrl,
      socialLinks: res.profile.socialLinks ?? [],
      resumeUrl: `${environment.apiBaseUrl}/profile/resume`,
    };
  }
}

