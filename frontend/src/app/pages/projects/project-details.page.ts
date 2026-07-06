import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { CodeCopyDirective } from '../../shared/directives/code-copy.directive';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import type { ProjectItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ContentImageComponent } from '../../shared/components/content-image/content-image.component';
import { ProjectsApi } from '../../api/projects.api';

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [RouterLink, MarkdownHtmlPipe, TagPillComponent, BreadcrumbsComponent, ContentImageComponent, CodeCopyDirective],
  templateUrl: './project-details.page.html',
  styleUrl: './project-details.page.scss',
})
export class ProjectDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsApi = inject(ProjectsApi);
  protected readonly project = signal<ProjectItem | null>(null);
  readonly loading = signal(true);

  protected backRoute = '/projects';

  protected get breadcrumbs(): BreadcrumbItem[] {
    return [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: this.project()?.title ?? 'Project', href: undefined },
    ];
  }

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      void this.load(slug);
    });
  }

  private async load(slug: string) {
    this.loading.set(true);
    this.project.set(null);
    try {
      this.project.set(await this.projectsApi.getBySlug(slug));
    } finally {
      this.loading.set(false);
    }
  }
}
