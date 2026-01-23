export interface Entregable {
  idEntregable?: number;
  idEjecucion: number;
  descripcionEntregable: string;
  numeroEntrega: number;
  rutaEntregable: string;
  rutaDACPAC: string|null;
  temporalBD: string|null;
  estadoEntrega: string,
  estadoEntregaId: number;
  rutaResultado:string|null;
}
