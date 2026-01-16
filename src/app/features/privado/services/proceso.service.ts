import { inject, Injectable } from "@angular/core";
import { HttpService } from "../../../core/services/http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private readonly API_URL = 'https://localhost:7133/api';
  private httpService = inject(HttpService);

  prepararAmbiente(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/first-step/${idEntregable}`,null);
  }
  preDeploy(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/second-step/${idEntregable}`,null);
  }
  deploy(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/third-step/${idEntregable}`,null);
  }
  enviarRevision(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/fourth-step/${idEntregable}`,null);
  }
  enviarCerrado(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/fifth-step/${idEntregable}`,null);
  }
}