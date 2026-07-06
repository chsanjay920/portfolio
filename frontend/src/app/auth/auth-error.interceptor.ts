import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isApiRequest = req.url.startsWith(environment.apiBaseUrl);
      const isLoginRequest = req.url.includes('/auth/login');

      if (err.status === 401 && isApiRequest && !isLoginRequest && auth.isAuthenticated()) {
        auth.logout();
        void router.navigateByUrl('/admin/login');
      }

      return throwError(() => err);
    }),
  );
};
