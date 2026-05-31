import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ContentImageComponent } from '../../shared/components/content-image/content-image.component';
import { BlogsApi } from '../../api/blogs.api';
import { ToastService } from '../../shared/toast/toast.service';
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
  private readonly toast = inject(ToastService);
  protected readonly postSlug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected readonly post = signal<BlogPost | null>(null);
  readonly loading = signal(true);

  protected backLabel = '← Back to Blogs';

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
      { label: 'Blogs', href: '/blogs' },
      { label: this.post()?.title ?? 'Blog', href: undefined },
    ];
  }

  constructor() {
    void this.load();
  }

  private async load() {
    try {
      this.post.set(await this.blogsApi.getBySlug(this.postSlug));
    } finally {
      this.loading.set(false);
    }
  }
}

