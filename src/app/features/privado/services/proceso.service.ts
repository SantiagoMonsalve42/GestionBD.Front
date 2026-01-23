import { inject, Injectable } from "@angular/core";
import { HttpService } from "../../../core/services/http.service";
import { API_URL } from "../../../core/services/config.service";
import { Observable } from "rxjs";
import { ArtefactoPreDeployResponse, ArtefactoValidationResponse } from "../types/artefacto.interface";

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private httpService = inject(HttpService);
  private readonly API_URL = inject(API_URL);

  prepararAmbiente(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/first-step/${idEntregable}`,null);
  }
  validarArtefactos(idEntregable: number): Observable<ArtefactoValidationResponse[]> {
    return this.httpService.post<ArtefactoValidationResponse[]>(`${this.API_URL}/Proceso/second-step/${idEntregable}`,null);
  }
  preDeploy(idEntregable: number): Observable<ArtefactoPreDeployResponse[]> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/third-step/${idEntregable}`,null);
  }
  generateRollback(idEntregable: number): Observable<ArtefactoPreDeployResponse[]> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/fourth-step/${idEntregable}`,null);
  }
  deploy(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/fifth-step/${idEntregable}`,null);
  }
  enviarRevision(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/sixth-step/${idEntregable}`,null);
  }
  enviarCerrado(idEntregable: number): Observable<any> {
    return this.httpService.post<any>(`${this.API_URL}/Proceso/seventh-step/${idEntregable}`,null);
  }
}