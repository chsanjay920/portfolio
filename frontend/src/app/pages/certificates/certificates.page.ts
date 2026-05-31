import { Component, inject, signal } from '@angular/core';
import { EntryCardComponent } from '../../shared/components/entry-card/entry-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import type { CertificateItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { CertificatesApi } from '../../api/certificates.api';

@Component({
  selector: 'app-certificates-page',
  standalone: true,
  imports: [SectionHeaderComponent, EntryCardComponent, BreadcrumbsComponent],
  templateUrl: './certificates.page.html',
  styleUrl: './certificates.page.scss',
})
export class CertificatesPageComponent {
  private readonly certificatesApi = inject(CertificatesApi);
  readonly items = signal<CertificateItem[]>([]);
  readonly loading = signal(true);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Certificates', href: '/certificates' },
  ];

  constructor() {
    void this.load();
  }

  private async load() {
    try {
      this.items.set(await this.certificatesApi.list());
    } finally {
      this.loading.set(false);
    }
  }
}

