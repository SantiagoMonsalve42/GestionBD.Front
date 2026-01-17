import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { API_URL } from '../../../core/services/config.service';
import { Artefacto, ArtefactoOrder } from '../types/artefacto.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtefactosService {
  private httpService = inject(HttpService);
  private readonly API_URL = inject(API_URL);

  getArtefactosByEntregable(idEntregable: number): Observable<Artefacto[]> {
    return this.httpService.get<Artefacto[]>(`${this.API_URL}/Artefactos/entregable/${idEntregable}`);
  }
  changeOrder(Artefactos : ArtefactoOrder[]): Observable<void>{
    return this.httpService.put(`${this.API_URL}/Artefactos/cambiarOrden/`,Artefactos);
  }
}
