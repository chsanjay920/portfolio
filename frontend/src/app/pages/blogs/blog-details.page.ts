import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ContentImageComponent } from '../../shared/components/content-image/content-image.component';
import { BlogsApi } from '../../api/blogs.api';
import type { BlogPost } from '../../models/portfolio.models';

@Component({
  selector: 'app-blog-details-page',
  standalone: true,
  imports: [RouterLink, MarkdownHtmlPipe, TagPillComponent, BreadcrumbsComponent, ContentImageComponent],
  templateUrl: './blog-details.page.html',
  styleUrl: './blog-details.page.scss',
})
export class BlogDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogsApi = inject(BlogsApi);
  protected readonly postSlug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected readonly post = signal<BlogPost | null>(null);

  protected backLabel = '← Back to Blogs';

  protected get breadcrumbs(): BreadcrumbItem[] {
    return [
      { label: 'Home', href: '/' },
      { label: 'Blogs', href: '/blogs' },
      { label: this.post()?.title ?? 'Blog', href: undefined },
    ];
  }

  constructor() {
    void this.load();
  }

  private async load() {
    this.post.set(await this.blogsApi.getBySlug(this.postSlug));
  }
}

