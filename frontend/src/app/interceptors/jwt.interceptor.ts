// jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip authentication requests
  if (req.url.includes('/token')) {
    return next(req);
  }
  
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Token expired, try to refresh
        return authService.refreshToken().pipe(
          switchMap(token => {
            // Clone request with new token
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token.access}`
              }
            });
            return next(newReq);
          }),
          catchError(refreshError => {
            // Refresh failed, logout
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};