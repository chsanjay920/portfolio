import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

type AdminNavItem = { label: string; href: string };

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly nav: AdminNavItem[] = [
    { label: 'Overview', href: '/admin' },
    { label: 'Profile', href: '/admin/profile' },
    { label: 'Blogs', href: '/admin/blogs' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Project Ideas', href: '/admin/project-ideas' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Certificates', href: '/admin/certificates' },
  ];

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/admin/login');
  }
}

