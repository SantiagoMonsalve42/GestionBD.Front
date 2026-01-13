import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { EstadisticasService } from '../../services/estadisticas.service';
import { DashboardEstadisticas } from '../../types/dashboard-estadisticas.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="dashboard-content">
      <h1 class="mb-4">Bienvenido al Dashboard</h1>
      
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-4">
            <p-card>
              <div class="flex align-items-center gap-3">
                <i class="pi pi-box text-4xl text-primary"></i>
                <div>
                  <p class="text-500 mb-1">Artefactos</p>
                  <h2 class="mt-0 mb-0">{{ estadisticas?.cantidadArtefactos || 0 }}</h2>
                </div>
              </div>
            </p-card>
          </div>
          
          <div class="col-12 md:col-6 lg:col-4">
            <p-card>
              <div class="flex align-items-center gap-3">
                <i class="pi pi-file text-4xl text-primary"></i>
                <div>
                  <p class="text-500 mb-1">Entregables</p>
                  <h2 class="mt-0 mb-0">{{ estadisticas?.cantidadEntregables || 0 }}</h2>
                </div>
              </div>
            </p-card>
          </div>
          
          <div class="col-12 md:col-6 lg:col-4">
            <p-card>
              <div class="flex align-items-center gap-3">
                <i class="pi pi-server text-4xl text-primary"></i>
                <div>
                  <p class="text-500 mb-1">Instancias</p>
                  <h2 class="mt-0 mb-0">{{ estadisticas?.cantidadInstancias || 0 }}</h2>
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
export class DashboardComponent implements OnInit {
  estadisticas: DashboardEstadisticas | null = null;
  error: string | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  private cargarEstadisticas(): void {
    this.error = null;

    this.estadisticasService.getDashboardEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.error = 'Error al cargar las estadísticas del dashboard';
      }
    });
  }
}
