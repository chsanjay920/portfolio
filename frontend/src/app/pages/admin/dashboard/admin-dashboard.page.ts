import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss',
})
export class AdminDashboardPageComponent {
  private readonly auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}

