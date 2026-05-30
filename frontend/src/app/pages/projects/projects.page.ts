import { Component, inject, signal } from '@angular/core';
import { EntryCardComponent } from '../../shared/components/entry-card/entry-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import type { ProjectItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProjectsApi } from '../../api/projects.api';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [SectionHeaderComponent, EntryCardComponent, BreadcrumbsComponent],
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.scss',
})
export class ProjectsPageComponent {
  private readonly projectsApi = inject(ProjectsApi);
  readonly posts = signal<ProjectItem[]>([]);
  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
  ];

  constructor() {
    void this.load();
  }

  private async load() {
    this.posts.set(await this.projectsApi.list());
  }
}

