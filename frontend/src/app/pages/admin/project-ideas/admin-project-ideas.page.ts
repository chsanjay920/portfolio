import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';

type IdeaDoc = {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  resources: { label: string; href: string }[];
  imageFileId?: string;
};

@Component({
  selector: 'app-admin-project-ideas-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-project-ideas.page.html',
  styleUrl: './admin-project-ideas.page.scss',
})
export class AdminProjectIdeasPageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<IdeaDoc[]>([]);
  protected readonly selected = signal<IdeaDoc | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required]),
    slug: this.fb.nonNullable.control(''),
    summary: this.fb.nonNullable.control('', [Validators.required]),
    content: this.fb.nonNullable.control('', [Validators.required]),
    resourcesJson: this.fb.nonNullable.control('[]'),
  });

  constructor() {
    void this.reload();
  }

  protected imageUrl(i: IdeaDoc): string | null {
    return i.imageFileId ? `${environment.apiBaseUrl}/files/${i.imageFileId}` : null;
  }

  async reload() {
    const res = await firstValueFrom(
      this.http.get<{ items: IdeaDoc[] }>(`${environment.apiBaseUrl}/projectIdeas`),
    );
    this.items.set(res.items);
  }

  select(i: IdeaDoc) {
    this.selected.set(i);
    this.form.patchValue({
      title: i.title,
      slug: i.slug,
      summary: i.summary,
      content: i.content,
      resourcesJson: JSON.stringify(i.resources ?? [], null, 2),
    });
  }

  newItem() {
    this.selected.set(null);
    this.form.reset({ title: '', slug: '', summary: '', content: '', resourcesJson: '[]' });
  }

  async save() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let resources: Array<{ label: string; href: string }> = [];
    try {
      resources = JSON.parse(this.form.controls.resourcesJson.value || '[]') as any;
      if (!Array.isArray(resources)) throw new Error('not array');
    } catch {
      this.error.set('Resources JSON must be a valid JSON array.');
      return;
    }

    const body = {
      title: this.form.controls.title.value,
      slug: this.form.controls.slug.value || undefined,
      summary: this.form.controls.summary.value,
      content: this.form.controls.content.value,
      resources,
      imageFileId: this.selected()?.imageFileId,
    };

    this.saving.set(true);
    try {
      const sel = this.selected();
      if (!sel) {
        await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/projectIdeas`, body));
        this.toast.success('Idea created');
      } else {
        await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/projectIdeas/${sel._id}`, body));
        this.toast.success('Idea updated');
      }
      await this.reload();
      this.newItem();
    } catch {
      this.error.set('Failed to save idea.');
      this.toast.error('Failed to save idea');
    } finally {
      this.saving.set(false);
    }
  }

  async remove(i: IdeaDoc) {
    if (!confirm(`Delete "${i.title}"?`)) return;
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/projectIdeas/${i._id}`));
      await this.reload();
      if (this.selected()?._id === i._id) this.newItem();
      this.toast.success('Idea deleted');
    } catch {
      this.error.set('Failed to delete idea.');
      this.toast.error('Failed to delete idea');
    }
  }

  async uploadImage(file: File | null) {
    const sel = this.selected();
    if (!file || !sel) {
      this.error.set('Select an idea first, then upload an image.');
      return;
    }
    this.error.set(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/projectIdeas/${sel._id}/image`, fd));
      await this.reload();
      this.toast.success('Image uploaded');
    } catch {
      this.error.set('Failed to upload image.');
      this.toast.error('Failed to upload image');
    }
  }
}

