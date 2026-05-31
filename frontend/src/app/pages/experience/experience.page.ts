import { Component, inject, signal } from '@angular/core';
import type { ExperienceItem } from '../../models/portfolio.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ExperienceApi } from '../../api/experience.api';

@Component({
  selector: 'app-experience-page',
  standalone: true,
  imports: [SectionHeaderComponent, MarkdownHtmlPipe, BreadcrumbsComponent],
  templateUrl: './experience.page.html',
  styleUrl: './experience.page.scss',
})
export class ExperiencePageComponent {
  private readonly experienceApi = inject(ExperienceApi);
  readonly items = signal<ExperienceItem[]>([]);
  readonly loading = signal(true);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Experience', href: '/experience' },
  ];

  constructor() {
    void this.load();
  }

  private async load() {
    try {
      this.items.set(await this.experienceApi.list());
    } finally {
      this.loading.set(false);
    }
  }
}

