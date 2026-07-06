import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/toast/toast.service';
import { getHttpErrorMessage } from '../../../shared/utils/http-error';

type EducationDoc = {
  _id: string;
  degree: string;
  institution: string;
  duration: string;
  details: string;
};

@Component({
  selector: 'app-admin-education-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-education.page.html',
  styleUrl: './admin-education.page.scss',
})
export class AdminEducationPageComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<EducationDoc[]>([]);
  protected readonly selected = signal<EducationDoc | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    degree: this.fb.nonNullable.control('', [Validators.required]),
    institution: this.fb.nonNullable.control('', [Validators.required]),
    duration: this.fb.nonNullable.control('', [Validators.required]),
    details: this.fb.nonNullable.control('', [Validators.required]),
  });

  constructor() {
    void this.reload();
  }

  async reload() {
    const res = await firstValueFrom(
      this.http.get<{ items: EducationDoc[] }>(`${environment.apiBaseUrl}/education`),
    );
    this.items.set(res.items);
  }

  select(e: EducationDoc) {
    this.selected.set(e);
    this.form.patchValue(e);
  }

  newItem() {
    this.selected.set(null);
    this.form.reset({ degree: '', institution: '', duration: '', details: '' });
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
        await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/education`, body));
        this.toast.success('Education created');
      } else {
        await firstValueFrom(this.http.put(`${environment.apiBaseUrl}/education/${sel._id}`, body));
        this.toast.success('Education updated');
      }
      await this.reload();
      this.newItem();
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to save education.');
      this.error.set(message);
      this.toast.error(message);
    } finally {
      this.saving.set(false);
    }
  }

  async remove(e: EducationDoc) {
    if (!confirm(`Delete "${e.degree}"?`)) return;
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/education/${e._id}`));
      await this.reload();
      if (this.selected()?._id === e._id) this.newItem();
      this.toast.success('Education deleted');
    } catch (err) {
      const message = getHttpErrorMessage(err, 'Failed to delete education.');
      this.error.set(message);
      this.toast.error(message);
    }
  }
}

