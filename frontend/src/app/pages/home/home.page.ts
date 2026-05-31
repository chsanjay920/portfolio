import { Component, inject, signal } from '@angular/core';
import { ProfileCardComponent } from '../../shared/components/profile/profile-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { EntryCardComponent } from '../../shared/components/entry-card/entry-card.component';
import type { BlogPost, ProfileData, ProjectItem } from '../../models/portfolio.models';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProfileApi } from '../../api/profile.api';
import { BlogsApi } from '../../api/blogs.api';
import { ProjectsApi } from '../../api/projects.api';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProfileCardComponent, SectionHeaderComponent, EntryCardComponent, BreadcrumbsComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePageComponent {
  private readonly profileApi = inject(ProfileApi);
  private readonly blogsApi = inject(BlogsApi);
  private readonly projectsApi = inject(ProjectsApi);

  readonly profile = signal<ProfileData | null>(null);
  readonly blogs = signal<BlogPost[]>([]);
  readonly projects = signal<ProjectItem[]>([]);
  readonly loading = signal(true);

  protected readonly breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  constructor() {
    void this.load();
  }

  private async load() {
    try {
      const [profile, blogs, projects] = await Promise.all([
        this.profileApi.getProfile(),
        this.blogsApi.list(),
        this.projectsApi.list(),
      ]);
      this.profile.set(profile);
      this.blogs.set(blogs);
      this.projects.set(projects);
    } finally {
      this.loading.set(false);
    }
  }
}

