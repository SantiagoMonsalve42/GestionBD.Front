export interface Artefacto {
  idArtefacto: number;
  idEntregable: number;
  ordenEjecucion: number;
  codificacion: string;
  nombreArtefacto: string;
  rutaRelativa: string;
  esReverso: boolean;
  descripcionEntregable: string;
}
export interface ArtefactoOrder{
    idArtefacto: number;
    ordenEjecucion: number;
}
