export interface LiquidosI {
  categoria: string;
  hora: number;
  liquido: string;
  subgrupo: string;
  cantidad: number;
}
export interface LiquidosAgrupadosI {
  liquido: string;
  categoria: string;
  subgrupo: string;
  resultados: LiquidosAbreviadosI[];
}
export interface LiquidosAbreviadosI {
  hora: number;
  cantidad: number;
}
