export interface ConsumidoI {
  NContrato: string;
  Contrato: string;
  Iteraciones: number;
  TotalEjecutado: number;
  TotalFacturado: number;
  ErrorAbsoluto: number;
  ErrorRelativo: number;
  Porcentaje: number;
  ValorAnticipo?: number;
}
