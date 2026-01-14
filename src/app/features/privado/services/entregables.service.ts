import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entregable } from '../types/entregable.interface';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EntregablesService {
  private readonly API_URL = 'https://localhost:7133/api';
  private httpService = inject(HttpService);
  private httpClient = inject(HttpClient);

  getEntregables(idEjecucion: number): Observable<Entregable[]> {
    return this.httpService.get<Entregable[]>(`${this.API_URL}/Entregables/Ejecucion/${idEjecucion}`);
  }

  getEntregableById(id: number): Observable<Entregable> {
    return this.httpService.get<Entregable>(`${this.API_URL}/Entregables/${id}`);
  }

  createEntregable(idEjecucion: number, file: File, descripcion: string): Observable<Entregable> {
    const formData = new FormData();
    formData.append('IdEjecucion', idEjecucion.toString());
    formData.append('File', file);
    formData.append('DescripcionEntregable', descripcion);

    // Use native HttpClient for multipart/form-data to avoid interceptors adding Content-Type
    return this.httpClient.post<Entregable>(`${this.API_URL}/Entregables`, formData);
  }

  updateEntregable(id: number, descripcion: string): Observable<Entregable> {
    return this.httpService.put<Entregable>(`${this.API_URL}/Entregables/${id}`, {
      descripcionEntregable: descripcion
    });
  }

  deleteEntregable(id: number): Observable<void> {
    return this.httpService.delete<void>(`${this.API_URL}/Entregables/${id}`);
  }
}
