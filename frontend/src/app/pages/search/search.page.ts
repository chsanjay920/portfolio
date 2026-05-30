import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchService } from '../../search/search.service';
import type { SearchResultGroup } from '../../search/search.types';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterLink, SectionHeaderComponent, BreadcrumbsComponent],
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss',
})
export class SearchPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  protected query = '';
  protected results: SearchResultGroup[] = [];

  protected readonly breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Search', href: '/search' }];

  constructor() {
    const initial = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.query = initial;
    void this.runSearch(initial);

    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') ?? '';
      this.query = q;
      void this.runSearch(q);
    });
  }

  protected onSubmit() {
    const q = this.query.trim();
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  private async runSearch(q: string) {
    this.results = await this.searchService.search(q);
  }
}

