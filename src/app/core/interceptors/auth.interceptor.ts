import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Excluir peticiones a assets o config
  if (req.url.includes('/assets/') || req.url.includes('config.json')) {
    return next(req);
  }

  const token = authService.getToken();

  if (token && authService.isAuthenticated()) {
    // Clonar la petición y agregar el header Authorization
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  }

  return next(req);
};
