import { Component, inject, signal } from '@angular/core';
import { EntryCardComponent } from '../../shared/components/entry-card/entry-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import type { BlogPost } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { BlogsApi } from '../../api/blogs.api';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [SectionHeaderComponent, EntryCardComponent, BreadcrumbsComponent],
  templateUrl: './blogs.page.html',
  styleUrl: './blogs.page.scss',
})
export class BlogsPageComponent {
  private readonly blogsApi = inject(BlogsApi);
  readonly posts = signal<BlogPost[]>([]);
  readonly loading = signal(true);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blogs' },
  ];

  constructor() {
    void this.load();
  }

  private async load() {
    try {
      this.posts.set(await this.blogsApi.list());
    } finally {
      this.loading.set(false);
    }
  }
}

