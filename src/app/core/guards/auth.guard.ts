import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const redirectService = inject(RedirectService);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Guardar la URL a la que intentaba acceder
    redirectService.saveRedirectUrl(state.url);
    
    // Redirigir a login de Keycloak
    await authService.login();
    return false;
  }

  // Verificar si la ruta requiere roles específicos
  const requiredRoles = route.data['roles'] as string[];
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));
    
    if (!hasRequiredRole) {
      // No tiene los permisos necesarios, redirigir a página de acceso denegado o home
      router.navigate(['/public']);
      return false;
    }
  }

  return true;
};

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const redirectService = inject(RedirectService);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    redirectService.saveRedirectUrl(state.url);
    await authService.login();
    return false;
  }

  const isAdmin = authService.hasRole('admin');

  if (!isAdmin) {
    router.navigate(['/core']);
    return false;
  }

  return true;
};
