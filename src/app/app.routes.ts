import { Routes } from '@angular/router';

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
    loadChildren: () => import('./features/privado/privado.routes').then(m => m.PRIVADO_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'public'
  }
];
