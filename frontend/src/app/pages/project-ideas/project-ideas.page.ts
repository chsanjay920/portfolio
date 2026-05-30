import { Component, inject, signal } from '@angular/core';
import { EntryCardComponent } from '../../shared/components/entry-card/entry-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import type { ProjectItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProjectIdeasApi } from '../../api/projectIdeas.api';

@Component({
  selector: 'app-project-ideas-page',
  standalone: true,
  imports: [SectionHeaderComponent, EntryCardComponent, BreadcrumbsComponent],
  templateUrl: './project-ideas.page.html',
  styleUrl: './project-ideas.page.scss',
})
export class ProjectIdeasPageComponent {
  private readonly ideasApi = inject(ProjectIdeasApi);
  readonly ideas = signal<ProjectItem[]>([]);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Project Ideas', href: '/project-ideas' },
  ];

  constructor() {
    void this.load();
  }

  private async load() {
    this.ideas.set(await this.ideasApi.list());
  }
}

