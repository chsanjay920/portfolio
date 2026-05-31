import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { ToastService } from '../../shared/toast/toast.service';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import type { ProjectItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ContentImageComponent } from '../../shared/components/content-image/content-image.component';
import { ProjectIdeasApi } from '../../api/projectIdeas.api';

@Component({
  selector: 'app-idea-details-page',
  standalone: true,
  imports: [RouterLink, MarkdownHtmlPipe, TagPillComponent, BreadcrumbsComponent, ContentImageComponent],
  templateUrl: './idea-details.page.html',
  styleUrl: './idea-details.page.scss',
})
export class IdeaDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly ideasApi = inject(ProjectIdeasApi);
  private readonly toast = inject(ToastService);
  protected readonly ideaSlug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected readonly idea = signal<ProjectItem | null>(null);
  readonly loading = signal(true);

  protected backRoute = '/project-ideas';

  protected async copyCode(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('.code-window__copy') as HTMLButtonElement | null;
    const code = button?.closest('.code-window')?.querySelector('pre code')?.textContent?.trim();
    if (!code) return;

    try {
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.toast.success('Code copied to clipboard');
    } catch {
      this.toast.error('Unable to copy code');
    }
  }

  protected get breadcrumbs(): BreadcrumbItem[] {
    return [
      { label: 'Home', href: '/' },
      { label: 'Project Ideas', href: '/project-ideas' },
      { label: this.idea()?.title ?? 'Idea', href: undefined },
    ];
  }

  constructor() {
    void this.load();
  }

  private async load() {
    try {
      this.idea.set(await this.ideasApi.getBySlug(this.ideaSlug));
    } finally {
      this.loading.set(false);
    }
  }
}

