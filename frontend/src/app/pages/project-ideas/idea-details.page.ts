import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { CodeCopyDirective } from '../../shared/directives/code-copy.directive';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import type { ProjectItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ContentImageComponent } from '../../shared/components/content-image/content-image.component';
import { ProjectIdeasApi } from '../../api/projectIdeas.api';

@Component({
  selector: 'app-idea-details-page',
  standalone: true,
  imports: [RouterLink, MarkdownHtmlPipe, TagPillComponent, BreadcrumbsComponent, ContentImageComponent, CodeCopyDirective],
  templateUrl: './idea-details.page.html',
  styleUrl: './idea-details.page.scss',
})
export class IdeaDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly ideasApi = inject(ProjectIdeasApi);
  protected readonly ideaSlug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected readonly idea = signal<ProjectItem | null>(null);
  readonly loading = signal(true);

  protected backRoute = '/project-ideas';

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

