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

export interface ArtefactoPreDeployResponse{
    isValid: boolean,
    script: string,
    status: string,
    message: string,
    additionalInfo: string
}

export interface ValidationIssue {
  code: string;
  message: string;
}

export interface SqlValidation {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
  hasErrors: boolean;
  hasWarnings: boolean;
  hasSuggestions: boolean;
}

export interface ArtefactoValidationResponse {
  name: string;
  sqlValidation: SqlValidation;
}
