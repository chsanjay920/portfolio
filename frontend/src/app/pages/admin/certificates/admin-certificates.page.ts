import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { getHttpErrorMessage } from '../../../shared/utils/http-error';

type CertificateDoc = {
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

@Component({
  selector: 'app-admin-certificates-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-certificates.page.html',
  styleUrl: './admin-certificates.page.scss',
})
export class AdminCertificatesPageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<CertificateDoc[]>([]);
  protected readonly selected = signal<CertificateDoc | null>(null);
  protected readonly pendingImageFile = signal<File | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    slug: this.fb.nonNullable.control(''),
    issuer: this.fb.nonNullable.control('', [Validators.required]),
    date: this.fb.nonNullable.control('', [Validators.required]),
    credentialLink: this.fb.nonNullable.control(''),
    summary: this.fb.nonNullable.control('', [Validators.required]),
    content: this.fb.nonNullable.control('', [Validators.required]),
  });

  constructor() {
    void this.reload();
  }

  protected imageUrl(c: CertificateDoc): string | null {
    return c.imageFileId ? `${environment.apiBaseUrl}/files/${c.imageFileId}` : null;
  }

  async reload() {
    const res = await firstValueFrom(
      this.http.get<{ items: CertificateDoc[] }>(`${environment.apiBaseUrl}/certificates`),
    );
    this.items.set(res.items);
  }

  select(c: CertificateDoc) {
    this.selected.set(c);
    this.pendingImageFile.set(null);
    this.form.patchValue({
      title: c.title,
      slug: c.slug,
      issuer: c.issuer,
      date: c.date,
      credentialLink: c.credentialLink ?? '',
      summary: c.summary,
      content: c.content,
    });
  }

  newItem() {
    this.selected.set(null);
    this.pendingImageFile.set(null);
    this.form.reset({ title: '', slug: '', issuer: '', date: '', credentialLink: '', summary: '', content: '' });
  }

  async save() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      title: this.form.controls.title.value,
      slug: this.form.controls.slug.value || undefined,
      issuer: this.form.controls.issuer.value,
      date: this.form.controls.date.value,
      credentialLink: this.form.controls.credentialLink.value || undefined,
      summary: this.form.controls.summary.value,
      content: this.form.controls.content.value,
    };

    this.saving.set(true);
    try {
      const sel = this.selected();
      let savedCertificate: CertificateDoc;

      if (!sel) {
        const res = await firstValueFrom(
          this.http.post<{ item: CertificateDoc }>(`${environment.apiBaseUrl}/certificates`, body),
        );
        savedCertificate = res.item;
        this.toast.success('Certificate created');
      } else {
        const res = await firstValueFrom(
          this.http.put<{ item: CertificateDoc }>(`${environment.apiBaseUrl}/certificates/${sel._id}`, body),
        );
        savedCertificate = res.item;
        this.toast.success('Certificate updated');
      }

      const pendingImage = this.pendingImageFile();
      if (pendingImage) {
        savedCertificate = await this.uploadImageToCertificate(savedCertificate._id, pendingImage);
        this.pendingImageFile.set(null);
      }

      await this.reload();
      this.selected.set(savedCertificate);
      this.form.patchValue({
        title: savedCertificate.title,
        slug: savedCertificate.slug,
        issuer: savedCertificate.issuer,
        date: savedCertificate.date,
        credentialLink: savedCertificate.credentialLink ?? '',
        summary: savedCertificate.summary,
        content: savedCertificate.content,
      });
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to save certificate.');
      this.error.set(message);
      this.toast.error(message);
    } finally {
      this.saving.set(false);
    }
  }

  async remove(c: CertificateDoc) {
    if (!confirm(`Delete "${c.title}"?`)) return;
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/certificates/${c._id}`));
      await this.reload();
      if (this.selected()?._id === c._id) this.newItem();
      this.toast.success('Certificate deleted');
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to delete certificate.');
      this.error.set(message);
      this.toast.error(message);
    }
  }

  async onImageSelected(file: File | null) {
    if (!file) return;

    const sel = this.selected();
    if (sel) {
      this.error.set(null);
      try {
        const certificate = await this.uploadImageToCertificate(sel._id, file);
        this.selected.set(certificate);
        await this.reload();
      } catch (err) {
        const message = getHttpErrorMessage(err, 'Failed to upload image.');
        this.error.set(message);
        this.toast.error(message);
      }
      return;
    }

    this.pendingImageFile.set(file);
    this.error.set(null);
    this.toast.success('Image will upload when you save the certificate');
  }

  private async uploadImageToCertificate(certificateId: string, file: File): Promise<CertificateDoc> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await firstValueFrom(
      this.http.post<{ item: CertificateDoc }>(`${environment.apiBaseUrl}/certificates/${certificateId}/image`, fd),
    );
    this.toast.success('Image uploaded');
    return res.item;
  }
}
