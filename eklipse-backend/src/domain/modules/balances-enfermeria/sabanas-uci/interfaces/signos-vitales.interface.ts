export interface SignosVitalesI {
  categoria: string;
  hora: number;
  signo: string;
  subgrupo: string;
  valor: string;
}
export interface SignosVitalesAgrupadosI {
  signo: string;
  categoria: string;
  subgrupo: string;
  resultados: SignosVitalesAbreviadosI[];
}
export interface SignosVitalesAbreviadosI {
  hora: number;
  valor: string;
}
