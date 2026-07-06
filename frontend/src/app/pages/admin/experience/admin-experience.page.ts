import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { getHttpErrorMessage } from '../../../shared/utils/http-error';

type ExperienceDoc = {
  _id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

@Component({
  selector: 'app-admin-experience-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-experience.page.html',
  styleUrl: './admin-experience.page.scss',
})
export class AdminExperiencePageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<ExperienceDoc[]>([]);
  protected readonly selected = signal<ExperienceDoc | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    role: this.fb.nonNullable.control('', [Validators.required]),
    company: this.fb.nonNullable.control('', [Validators.required]),
    duration: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control('', [Validators.required]),
  });

  constructor() {
    void this.reload();
  }

  async reload() {
    const res = await firstValueFrom(
      this.http.get<{ items: ExperienceDoc[] }>(`${environment.apiBaseUrl}/experience`),
    );
    this.items.set(res.items);
  }

  select(e: ExperienceDoc) {
    this.selected.set(e);
    this.form.patchValue(e);
  }

  newItem() {
    this.selected.set(null);
    this.form.reset({ role: '', company: '', duration: '', description: '' });
  }

  async save() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = this.form.getRawValue();

    this.saving.set(true);
    try {
      const sel = this.selected();
      if (!sel) {
        await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/experience`, body));
        this.toast.success('Experience created');
      } else {
        await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/experience/${sel._id}`, body));
        this.toast.success('Experience updated');
      }
      await this.reload();
      this.newItem();
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to save experience.');
      this.error.set(message);
      this.toast.error(message);
    } finally {
      this.saving.set(false);
    }
  }

  async remove(e: ExperienceDoc) {
    if (!confirm(`Delete "${e.role}"?`)) return;
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/experience/${e._id}`));
      await this.reload();
      if (this.selected()?._id === e._id) this.newItem();
      this.toast.success('Experience deleted');
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to delete experience.');
      this.error.set(message);
      this.toast.error(message);
    }
  }
}

