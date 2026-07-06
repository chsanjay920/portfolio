import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { getHttpErrorMessage } from '../../../shared/utils/http-error';

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
  protected readonly pendingImageFile = signal<File | null>(null);
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
    this.pendingImageFile.set(null);
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
    this.pendingImageFile.set(null);
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
      let savedProject: ProjectDoc;

      if (!sel) {
        const res = await firstValueFrom(
          this.http.post<{ item: ProjectDoc }>(`${environment.apiBaseUrl}/projects`, body),
        );
        savedProject = res.item;
        this.toast.success('Project created');
      } else {
        const res = await firstValueFrom(
          this.http.put<{ item: ProjectDoc }>(`${environment.apiBaseUrl}/projects/${sel._id}`, body),
        );
        savedProject = res.item;
        this.toast.success('Project updated');
      }

      const pendingImage = this.pendingImageFile();
      if (pendingImage) {
        savedProject = await this.uploadImageToProject(savedProject._id, pendingImage);
        this.pendingImageFile.set(null);
      }

      await this.reload();
      this.selected.set(savedProject);
      this.form.patchValue({
        title: savedProject.title,
        slug: savedProject.slug,
        summary: savedProject.summary,
        content: savedProject.content,
        techStackCsv: (savedProject.techStack ?? []).join(', '),
        linksJson: JSON.stringify(savedProject.links ?? [], null, 2),
      });
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to save project.');
      this.error.set(message);
      this.toast.error(message);
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
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to delete project.');
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
        const project = await this.uploadImageToProject(sel._id, file);
        this.selected.set(project);
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
    this.toast.success('Image will upload when you save the project');
  }

  private async uploadImageToProject(projectId: string, file: File): Promise<ProjectDoc> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await firstValueFrom(
      this.http.post<{ item: ProjectDoc }>(`${environment.apiBaseUrl}/projects/${projectId}/images`, fd),
    );
    this.toast.success('Image uploaded');
    return res.item;
  }
}
