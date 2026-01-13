import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Instancia, Motor } from '../types/instancia.interface';

@Injectable({
  providedIn: 'root'
})
export class InstanciasService {
  private readonly API_URL = 'https://localhost:7133/api';
  private httpService = inject(HttpService);

  getInstancias(): Observable<Instancia[]> {
    return this.httpService.get<Instancia[]>(`${this.API_URL}/instancias`);
  }

  getInstanciaById(id: number): Observable<Instancia> {
    return this.httpService.get<Instancia>(`${this.API_URL}/instancias/${id}`);
  }

  createInstancia(instancia: Instancia): Observable<Instancia> {
    return this.httpService.post<Instancia>(`${this.API_URL}/instancias`, instancia);
  }

  updateInstancia(id: number, instancia: Instancia): Observable<Instancia> {
    return this.httpService.put<Instancia>(`${this.API_URL}/instancias/${id}`, instancia);
  }

  deleteInstancia(id: number): Observable<void> {
    return this.httpService.delete<void>(`${this.API_URL}/instancias/${id}`);
  }

  getMotores(): Observable<Motor[]> {
    return this.httpService.get<Motor[]>(`${this.API_URL}/Motores`);
  }
}
