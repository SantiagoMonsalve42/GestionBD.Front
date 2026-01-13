export interface Instancia {
  idInstancia?: number;
  idMotor: number;
  instancia: string;
  puerto: number;
  usuario: string;
  password: string;
  nombreDB: string;
}

export interface Motor {
  idMotor: number;
  nombreMotor: string;
  versionMotor: string;
  descripcionMotor: string;
}
