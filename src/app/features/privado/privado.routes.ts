import { Routes } from '@angular/router';

export const PRIVADO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'connections',
        loadComponent: () => import('./pages/conexiones/conexiones.component').then(m => m.ConexionesComponent)
      },
      {
        path: 'executions',
        loadComponent: () => import('./pages/entregables/entregables.component').then(m => m.EntregablesComponent)
      },
      {
        path: 'executions/:id/deliverables',
        loadComponent: () => import('./pages/entregas/entregas.component').then(m => m.EntregasComponent)
      },
      {
        path: 'deliverables/:id/artifacts',
        loadComponent: () => import('./pages/artefactos/artefactos.component').then(m => m.ArtefactosComponent)
      }
    ]
  }
];
