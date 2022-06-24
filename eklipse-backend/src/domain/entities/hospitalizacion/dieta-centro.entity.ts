import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("GCMHOSDIECEN")
export class DietaCentroEntity extends BaseEntity {
  @Column({ name: "ADNCENATE" })
  CENTROATENCION: number;

  @Column({ name: "DIEFECJOR" })
  FECHADIETA: Date;

  @Column({ name: "DIEJORDES", default: null })
  DIETADESAYUNO: number;

  @Column({ name: "DIEJORALM", default: null })
  DIETAALMUERZO: number;

  @Column({ name: "DIEJORCEN", default: null })
  DIETACENA: number;

  @Column({ name: "DIEESTADO" })
  DIETAESTADO: number;

  @Column({ name: "GENUSUREG" })
  USERREGDIETA: number;

  @CreateDateColumn({ name: "FECHORREG", type: "datetime" })
  FECHAREGDIETA: Date;
}
