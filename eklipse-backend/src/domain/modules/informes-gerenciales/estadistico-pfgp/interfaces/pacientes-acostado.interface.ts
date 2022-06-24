export interface PacienteAcostadoI {
  Ingreso: number;
  Identificacion: string;
  Paciente: string;
  AINFECING: string;
  DiasEstancia: number;
  TipoIngreso: string;
  CodCama: string;
  Cama: string;
  TotalEjecutado: number;
  Estancias?: EstanciaI[];
}

export interface EstanciaI {
  Ingreso: number;
  FechaIngreso: string;
  FechaSalida: string;
  Grupo: string;
  Cama: string;
}
