import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          // Only logout for authentication endpoints, not for admin operations
          const url = error.url || '';
          if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/users/profile')) {
            authService.logout();
          }
          // For other 401 errors (like admin operations), let the component handle it
          errorMessage = 'Session expired. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 409) {
          // Conflict - usually duplicate resource (e.g., email already exists)
          errorMessage = error.error?.message || error.error || 'This email is already registered. Please use a different email or login.';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred';
        } else {
          errorMessage = error.error?.message || error.message || 'Unknown error';
        }
      }

      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};

