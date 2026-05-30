import { Component, inject, signal } from '@angular/core';
import type { EducationItem } from '../../models/portfolio.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { EducationApi } from '../../api/education.api';

@Component({
  selector: 'app-education-page',
  standalone: true,
  imports: [SectionHeaderComponent, MarkdownHtmlPipe, BreadcrumbsComponent],
  templateUrl: './education.page.html',
  styleUrl: './education.page.scss',
})
export class EducationPageComponent {
  private readonly educationApi = inject(EducationApi);
  readonly items = signal<EducationItem[]>([]);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Education', href: '/education' },
  ];

  constructor() {
    void this.load();
  }

  private async load() {
    this.items.set(await this.educationApi.list());
  }
}

