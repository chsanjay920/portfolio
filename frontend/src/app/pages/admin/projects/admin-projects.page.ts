import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';

type ProjectDoc = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  techStack: string[];
  links: { label: string; href: string }[];
  imageFileIds: string[];
};

@Component({
  selector: 'app-admin-projects-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-projects.page.html',
  styleUrl: './admin-projects.page.scss',
})
export class AdminProjectsPageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<ProjectDoc[]>([]);
  protected readonly selected = signal<ProjectDoc | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    slug: this.fb.nonNullable.control(''),
    summary: this.fb.nonNullable.control('', [Validators.required]),
    content: this.fb.nonNullable.control('', [Validators.required]),
    techStackCsv: this.fb.nonNullable.control(''),
    linksJson: this.fb.nonNullable.control('[]'),
  });

  constructor() {
    void this.reload();
  }

  protected imageUrl(p: ProjectDoc): string | null {
    const id = p.imageFileIds?.[0];
    return id ? `${environment.apiBaseUrl}/files/${id}` : null;
  }

  async reload() {
    const res = await firstValueFrom(
      this.http.get<{ items: ProjectDoc[] }>(`${environment.apiBaseUrl}/projects`),
    );
    this.items.set(res.items);
  }

  select(p: ProjectDoc) {
    this.selected.set(p);
    this.form.patchValue({
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      content: p.content,
      techStackCsv: (p.techStack ?? []).join(', '),
      linksJson: JSON.stringify(p.links ?? [], null, 2),
    });
  }

  newItem() {
    this.selected.set(null);
    this.form.reset({ title: '', slug: '', summary: '', content: '', techStackCsv: '', linksJson: '[]' });
  }

  async save() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let links: Array<{ label: string; href: string }> = [];
    try {
      links = JSON.parse(this.form.controls.linksJson.value || '[]') as any;
      if (!Array.isArray(links)) throw new Error('not array');
    } catch {
      this.error.set('Links JSON must be a valid JSON array.');
      return;
    }

    const techStack = this.form.controls.techStackCsv.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title: this.form.controls.title.value,
      slug: this.form.controls.slug.value || undefined,
      summary: this.form.controls.summary.value,
      content: this.form.controls.content.value,
      techStack,
      links,
      imageFileIds: this.selected()?.imageFileIds ?? [],
    };

    this.saving.set(true);
    try {
      const sel = this.selected();
      if (!sel) {
        await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/projects`, body));
        this.toast.success('Project created');
      } else {
        await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/projects/${sel._id}`, body));
        this.toast.success('Project updated');
      }
      await this.reload();
      this.newItem();
    } catch {
      this.error.set('Failed to save project.');
      this.toast.error('Failed to save project');
    } finally {
      this.saving.set(false);
    }
  }

  async remove(p: ProjectDoc) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/projects/${p._id}`));
      await this.reload();
      if (this.selected()?._id === p._id) this.newItem();
      this.toast.success('Project deleted');
    } catch {
      this.error.set('Failed to delete project.');
      this.toast.error('Failed to delete project');
    }
  }

  async uploadImage(file: File | null) {
    const sel = this.selected();
    if (!file || !sel) {
      this.error.set('Select a project first, then upload an image.');
      return;
    }
    this.error.set(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/projects/${sel._id}/images`, fd));
      await this.reload();
      this.toast.success('Image uploaded');
    } catch {
      this.error.set('Failed to upload image.');
      this.toast.error('Failed to upload image');
    }
  }
}

