import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'publico',
    pathMatch: 'full'
  },
  {
    path: 'publico',
    loadChildren: () => import('./features/publico/publico.routes').then(m => m.PUBLICO_ROUTES)
  },
  {
    path: 'privado',
    loadChildren: () => import('./features/privado/privado.routes').then(m => m.PRIVADO_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'publico'
  }
];
