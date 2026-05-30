import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';
export type ToastItem = { id: string; kind: ToastKind; message: string };

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(kind: ToastKind, message: string, opts?: { durationMs?: number }) {
    const id = uid();
    const item: ToastItem = { id, kind, message };
    this.toasts.update((t) => [...t, item]);

    const durationMs = opts?.durationMs ?? 3000;
    window.setTimeout(() => this.dismiss(id), durationMs);
  }

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message, { durationMs: 4500 });
  }

  info(message: string) {
    this.show('info', message);
  }

  dismiss(id: string) {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}

