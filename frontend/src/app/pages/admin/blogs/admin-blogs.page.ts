import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { getHttpErrorMessage } from '../../../shared/utils/http-error';

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
  protected readonly pendingBannerFile = signal<File | null>(null);
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
      this.pendingBannerFile.set(null);
      this.form.patchValue({
        title: res.blog.title,
        slug: res.blog.slug,
        summary: res.blog.summary,
        publishDate: res.blog.publishDate,
        tagsCsv: (res.blog.tags ?? []).join(', '),
        content: res.blog.content,
      });
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to load blog.');
      this.error.set(message);
    }
  }

  newPost() {
    this.selected.set(null);
    this.pendingBannerFile.set(null);
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
      let savedBlog: BlogDoc;

      if (!sel) {
        const res = await firstValueFrom(
          this.http.post<{ blog: BlogDoc }>(`${environment.apiBaseUrl}/blogs`, body),
        );
        savedBlog = res.blog;
        this.toast.success('Blog created');
      } else {
        const res = await firstValueFrom(
          this.http.put<{ blog: BlogDoc }>(`${environment.apiBaseUrl}/blogs/${sel._id}`, body),
        );
        savedBlog = res.blog;
        this.toast.success('Blog updated');
      }

      const pendingBanner = this.pendingBannerFile();
      if (pendingBanner) {
        savedBlog = await this.uploadBannerToBlog(savedBlog._id, pendingBanner);
        this.pendingBannerFile.set(null);
      }

      await this.reload();
      this.selected.set(savedBlog);
      this.form.patchValue({
        title: savedBlog.title,
        slug: savedBlog.slug,
        summary: savedBlog.summary,
        publishDate: savedBlog.publishDate,
        tagsCsv: (savedBlog.tags ?? []).join(', '),
        content: savedBlog.content,
      });
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to save blog.');
      this.error.set(message);
      this.toast.error(message);
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
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to delete blog.');
      this.error.set(message);
      this.toast.error(message);
    }
  }

  async uploadMarkdown(file: File | null) {
    if (!file) return;
    const text = await file.text();
    this.form.controls.content.setValue(text);
  }

  async onBannerSelected(file: File | null) {
    if (!file) return;

    const sel = this.selected();
    if (sel) {
      this.error.set(null);
      try {
        const blog = await this.uploadBannerToBlog(sel._id, file);
        this.selected.set(blog);
        await this.reload();
      } catch (err) {
        const message = getHttpErrorMessage(err, 'Failed to upload banner.');
        this.error.set(message);
        this.toast.error(message);
      }
      return;
    }

    this.pendingBannerFile.set(file);
    this.error.set(null);
    this.toast.success('Banner will upload when you save the post');
  }

  private async uploadBannerToBlog(blogId: string, file: File): Promise<BlogDoc> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await firstValueFrom(
      this.http.post<{ blog: BlogDoc }>(`${environment.apiBaseUrl}/blogs/${blogId}/banner`, fd),
    );
    this.toast.success('Banner uploaded');
    return res.blog;
  }
}

