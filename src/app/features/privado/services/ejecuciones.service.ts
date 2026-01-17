import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { API_URL } from '../../../core/services/config.service';
import { Ejecucion } from '../types/ejecucion.interface';

@Injectable({
  providedIn: 'root'
})
export class EjecucionesService {
  private httpService = inject(HttpService);
  private readonly API_URL = inject(API_URL);

  getEjecuciones(): Observable<Ejecucion[]> {
    return this.httpService.get<Ejecucion[]>(`${this.API_URL}/Ejecuciones`);
  }

  getEjecucionById(id: number): Observable<Ejecucion> {
    return this.httpService.get<Ejecucion>(`${this.API_URL}/Ejecuciones/${id}`);
  }

  createEjecucion(ejecucion: Ejecucion): Observable<Ejecucion> {
    return this.httpService.post<Ejecucion>(`${this.API_URL}/Ejecuciones`, ejecucion);
  }

  updateEjecucion(id: number, ejecucion: Ejecucion): Observable<Ejecucion> {
    return this.httpService.put<Ejecucion>(`${this.API_URL}/Ejecuciones/${id}`, ejecucion);
  }

  deleteEjecucion(id: number): Observable<void> {
    return this.httpService.delete<void>(`${this.API_URL}/Ejecuciones/${id}`);
  }
}
