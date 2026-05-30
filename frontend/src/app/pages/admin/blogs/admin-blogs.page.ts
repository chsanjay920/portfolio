import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';

type BlogListItem = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  publishDate: string;
  tags: string[];
  bannerFileId?: string;
};

type BlogDoc = BlogListItem & { content: string };

@Component({
  selector: 'app-admin-blogs-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-blogs.page.html',
  styleUrl: './admin-blogs.page.scss',
})
export class AdminBlogsPageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<BlogListItem[]>([]);
  protected readonly selected = signal<BlogDoc | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    slug: this.fb.nonNullable.control(''),
    summary: this.fb.nonNullable.control('', [Validators.required]),
    publishDate: this.fb.nonNullable.control('', [Validators.required]),
    tagsCsv: this.fb.nonNullable.control(''),
    content: this.fb.nonNullable.control('', [Validators.required]),
  });

  constructor() {
    void this.reload();
  }

  protected bannerUrl(item: BlogListItem): string | null {
    return item.bannerFileId ? `${environment.apiBaseUrl}/files/${item.bannerFileId}` : null;
  }

  async reload() {
    const res = await firstValueFrom(
      this.http.get<{ items: BlogListItem[] }>(`${environment.apiBaseUrl}/blogs`, {
        params: { limit: 50, page: 1 },
      }),
    );
    this.items.set(res.items);
  }

  async select(item: BlogListItem) {
    this.error.set(null);
    try {
      const res = await firstValueFrom(
        this.http.get<{ blog: BlogDoc }>(`${environment.apiBaseUrl}/blogs/${encodeURIComponent(item.slug)}`),
      );
      this.selected.set(res.blog);
      this.form.patchValue({
        title: res.blog.title,
        slug: res.blog.slug,
        summary: res.blog.summary,
        publishDate: res.blog.publishDate,
        tagsCsv: (res.blog.tags ?? []).join(', '),
        content: res.blog.content,
      });
    } catch {
      this.error.set('Failed to load blog.');
    }
  }

  newPost() {
    this.selected.set(null);
    this.form.reset({
      title: '',
      slug: '',
      summary: '',
      publishDate: new Date().toISOString().slice(0, 10),
      tagsCsv: '',
      content: '',
    });
  }

  async save() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const tags = this.form.controls.tagsCsv.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title: this.form.controls.title.value,
      slug: this.form.controls.slug.value || undefined,
      summary: this.form.controls.summary.value,
      publishDate: this.form.controls.publishDate.value,
      tags,
      content: this.form.controls.content.value,
    };

    this.saving.set(true);
    try {
      const sel = this.selected();
      if (!sel) {
        await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/blogs`, body));
        this.toast.success('Blog created');
      } else {
        await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/blogs/${sel._id}`, body));
        this.toast.success('Blog updated');
      }
      await this.reload();
      this.newPost();
    } catch {
      this.error.set('Failed to save blog.');
      this.toast.error('Failed to save blog');
    } finally {
      this.saving.set(false);
    }
  }

  async remove(item: BlogListItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/blogs/${item._id}`));
      await this.reload();
      if (this.selected()?._id === item._id) this.newPost();
      this.toast.success('Blog deleted');
    } catch {
      this.error.set('Failed to delete blog.');
      this.toast.error('Failed to delete blog');
    }
  }

  async uploadMarkdown(file: File | null) {
    if (!file) return;
    const text = await file.text();
    this.form.controls.content.setValue(text);
  }

  async uploadBanner(file: File | null) {
    const sel = this.selected();
    if (!file || !sel) {
      this.error.set('Select a blog first, then upload a banner.');
      return;
    }
    this.error.set(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/blogs/${sel._id}/banner`, fd));
      await this.reload();
      this.toast.success('Banner uploaded');
    } catch {
      this.error.set('Failed to upload banner.');
      this.toast.error('Failed to upload banner');
    }
  }
}

