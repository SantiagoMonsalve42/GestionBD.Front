import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    loadChildren: () => import('./features/publico/publico.routes').then(m => m.PUBLICO_ROUTES)
  },
  {
    path: 'core',
    canActivate: [authGuard],
    loadChildren: () => import('./features/privado/privado.routes').then(m => m.PRIVADO_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'public'
  }
];
