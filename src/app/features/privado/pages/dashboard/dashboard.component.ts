import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="dashboard-content">
      <h1 class="mb-4">Bienvenido al Dashboard</h1>
      
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <p-card>
            <div class="flex align-items-center gap-3">
              <i class="pi pi-users text-4xl text-primary"></i>
              <div>
                <p class="text-500 mb-1">Usuarios</p>
                <h2 class="mt-0 mb-0">150</h2>
              </div>
            </div>
          </p-card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <p-card>
            <div class="flex align-items-center gap-3">
              <i class="pi pi-folder text-4xl text-primary"></i>
              <div>
                <p class="text-500 mb-1">Proyectos</p>
                <h2 class="mt-0 mb-0">45</h2>
              </div>
            </div>
          </p-card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <p-card>
            <div class="flex align-items-center gap-3">
              <i class="pi pi-file text-4xl text-primary"></i>
              <div>
                <p class="text-500 mb-1">Scripts</p>
                <h2 class="mt-0 mb-0">320</h2>
              </div>
            </div>
          </p-card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <p-card>
            <div class="flex align-items-center gap-3">
              <i class="pi pi-server text-4xl text-primary"></i>
              <div>
                <p class="text-500 mb-1">Conexiones</p>
                <h2 class="mt-0 mb-0">12</h2>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class DashboardComponent {}
