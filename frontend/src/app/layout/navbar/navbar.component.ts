import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileApi } from '../../api/profile.api';

type NavItem = { label: string; href: string };

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly profileApi = inject(ProfileApi);
  readonly brand = signal('Portfolio');

  readonly navItems: NavItem[] = [
    { label: 'Blogs', href: '/blogs' },
    { label: 'Projects', href: '/projects' },
    { label: 'Project Ideas', href: '/project-ideas' },
    { label: 'Experience', href: '/experience' },
    { label: 'Education', href: '/education' },
    { label: 'Certificates', href: '/certificates' },
  ];

  menuOpen = false;

  constructor() {
    void this.loadBrand();
  }

  private async loadBrand() {
    const p = await this.profileApi.getProfile();
    if (p?.fullName) this.brand.set(p.fullName);
  }

  onNavClick() {
    this.menuOpen = false;
  }

  // Search is accessed via the "Search" nav link.
}

