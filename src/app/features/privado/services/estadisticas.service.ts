import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { API_URL } from '../../../core/services/config.service';
import { DashboardEstadisticas } from '../types/dashboard-estadisticas.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private httpService = inject(HttpService);
  private readonly apiUrl = inject(API_URL);

  getDashboardEstadisticas(): Observable<DashboardEstadisticas> {
    return this.httpService.get<DashboardEstadisticas>(`${this.apiUrl}/Estadisticas/dashboard`);
  }
}
