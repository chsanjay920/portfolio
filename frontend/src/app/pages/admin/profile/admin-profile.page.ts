import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { getHttpErrorMessage } from '../../../shared/utils/http-error';

type SocialLink = { platform: string; label: string; href: string };
type ProfileApiDoc = {
  fullName: string;
  title: string;
  bio: string;
  avatarInitials: string;
  avatarAlt: string;
  socialLinks: SocialLink[];
  photoFileId?: string;
  resumeFileId?: string;
};

@Component({
  selector: 'app-admin-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-profile.page.html',
  styleUrl: './admin-profile.page.scss',
})
export class AdminProfilePageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly current = signal<ProfileApiDoc | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    fullName: this.fb.nonNullable.control('', [Validators.required]),
    title: this.fb.nonNullable.control('', [Validators.required]),
    bio: this.fb.nonNullable.control('', [Validators.required]),
    avatarInitials: this.fb.nonNullable.control('', [Validators.required]),
    avatarAlt: this.fb.nonNullable.control('Profile avatar', [Validators.required]),
    socialLinks: this.fb.array([this.createSocialLinkGroup()]),
  });

  constructor() {
    void this.load();
  }

  protected photoUrl(): string | null {
    const p = this.current();
    return p?.photoFileId ? `${environment.apiBaseUrl}/files/${p.photoFileId}` : null;
  }

  protected resumeUrl(): string {
    return `${environment.apiBaseUrl}/profile/resume`;
  }

  protected get socialLinks(): FormArray {
    return this.form.controls.socialLinks;
  }

  protected addSocialLink(link: Partial<SocialLink> = {}) {
    this.socialLinks.push(this.createSocialLinkGroup(link));
  }

  protected removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
    if (this.socialLinks.length === 0) {
      this.addSocialLink();
    }
  }

  private createSocialLinkGroup(link: Partial<SocialLink> = {}) {
    return this.fb.nonNullable.group({
      platform: this.fb.nonNullable.control(link.platform ?? 'Website'),
      label: this.fb.nonNullable.control(link.label ?? ''),
      href: this.fb.nonNullable.control(link.href ?? ''),
    });
  }

  private setSocialLinks(links: SocialLink[]) {
    this.socialLinks.clear();
    const nextLinks = links.length ? links : [{}];
    nextLinks.forEach((link) => this.addSocialLink(link));
  }

  private async load() {
    const res = await firstValueFrom(
      this.http.get<{ profile: ProfileApiDoc | null }>(`${environment.apiBaseUrl}/profile`),
    );
    if (res.profile) {
      this.current.set(res.profile);
      this.form.patchValue({
        fullName: res.profile.fullName,
        title: res.profile.title,
        bio: res.profile.bio,
        avatarInitials: res.profile.avatarInitials,
        avatarAlt: res.profile.avatarAlt,
      });
      this.setSocialLinks(res.profile.socialLinks ?? []);
    }
  }

  async save() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const socialLinks = this.socialLinks.controls
      .map((control) => control.value as SocialLink)
      .map((link) => ({
        platform: (link.platform ?? '').trim(),
        label: (link.label ?? '').trim(),
        href: (link.href ?? '').trim(),
      }));
    const incompleteLink = socialLinks.some(
      (link) => (link.platform || link.label || link.href) && (!link.platform || !link.label || !link.href),
    );
    if (incompleteLink) {
      this.error.set('Complete each social profile, or leave the row blank.');
      return;
    }
    const completedSocialLinks = socialLinks.filter((link) => link.platform && link.label && link.href);

    this.saving.set(true);
    try {
      const body = {
        fullName: this.form.controls.fullName.value,
        title: this.form.controls.title.value,
        bio: this.form.controls.bio.value,
        avatarInitials: this.form.controls.avatarInitials.value,
        avatarAlt: this.form.controls.avatarAlt.value,
        socialLinks: completedSocialLinks,
      };
      const res = await firstValueFrom(
        this.http.put<{ profile: ProfileApiDoc }>(`${environment.apiBaseUrl}/profile`, body),
      );
      this.current.set(res.profile);
      this.toast.success('Profile saved');
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to save profile.');
      this.error.set(message);
      this.toast.error(message);
    } finally {
      this.saving.set(false);
    }
  }

  async uploadPhoto(file: File | null) {
    if (!file) return;
    this.error.set(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await firstValueFrom(
        this.http.post<{ profile: ProfileApiDoc }>(`${environment.apiBaseUrl}/profile/photo`, fd),
      );
      this.current.set(res.profile);
      this.toast.success('Photo uploaded');
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to upload photo.');
      this.error.set(message);
      this.toast.error(message);
    }
  }

  async uploadResume(file: File | null) {
    if (!file) return;
    this.error.set(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await firstValueFrom(
        this.http.post<{ profile: ProfileApiDoc }>(`${environment.apiBaseUrl}/profile/resume`, fd),
      );
      this.current.set(res.profile);
      this.toast.success('Resume uploaded');
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to upload resume.');
      this.error.set(message);
      this.toast.error(message);
    }
  }
}

