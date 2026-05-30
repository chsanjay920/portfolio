import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownHtmlPipe } from '../../shared/pipes/markdown-html.pipe';
import { TagPillComponent } from '../../shared/components/tag-pill/tag-pill.component';
import type { CertificateItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ContentImageComponent } from '../../shared/components/content-image/content-image.component';
import { CertificatesApi } from '../../api/certificates.api';

@Component({
  selector: 'app-certificate-details-page',
  standalone: true,
  imports: [RouterLink, MarkdownHtmlPipe, TagPillComponent, BreadcrumbsComponent, ContentImageComponent],
  templateUrl: './certificate-details.page.html',
  styleUrl: './certificate-details.page.scss',
})
export class CertificateDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly certificatesApi = inject(CertificatesApi);
  protected readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  protected readonly item = signal<CertificateItem | null>(null);

  protected backRoute = '/certificates';

  protected get breadcrumbs(): BreadcrumbItem[] {
    return [
      { label: 'Home', href: '/' },
      { label: 'Certificates', href: '/certificates' },
      { label: this.item()?.title ?? 'Certificate', href: undefined },
    ];
  }

  constructor() {
    void this.load();
  }

  private async load() {
    this.item.set(await this.certificatesApi.getBySlug(this.slug));
  }
}

