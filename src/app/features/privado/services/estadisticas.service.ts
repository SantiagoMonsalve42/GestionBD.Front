import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { DashboardEstadisticas } from '../types/dashboard-estadisticas.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private apiUrl = 'https://localhost:7133/api';

  constructor(private httpService: HttpService) {}

  getDashboardEstadisticas(): Observable<DashboardEstadisticas> {
    return this.httpService.get<DashboardEstadisticas>(`${this.apiUrl}/Estadisticas/dashboard`);
  }
}
