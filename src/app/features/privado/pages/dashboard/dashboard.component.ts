import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard - Área Privada</h1>
      <p>Este es un componente de ejemplo del feature privado</p>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Usuarios</h3>
          <p class="stat-number">150</p>
        </div>
        <div class="stat-card">
          <h3>Proyectos</h3>
          <p class="stat-number">45</p>
        </div>
        <div class="stat-card">
          <h3>Tareas</h3>
          <p class="stat-number">320</p>
        </div>
      </div>
      <div class="info-box">
        <h2>Acceso Restringido</h2>
        <p>Esta página requiere autenticación para ser accedida</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      opacity: 0.9;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0;
    }

    .info-box {
      background-color: #fff3cd;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1.5rem;
      border-left: 4px solid #ffc107;
    }

    .info-box h2 {
      color: #856404;
      margin-bottom: 0.5rem;
    }

    .info-box p {
      color: #856404;
    }
  `]
})
export class DashboardComponent {}
