import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("GCMHOSDIEJOR")
export class DietaJornadaEntity extends BaseEntity {
  @Column({ name: "GCMDIECEN" })
  DIETACENTRO: number;

  @Column({ name: "ADNCENATE" })
  CENTROATENCION: number;

  @Column({ name: "DIEFECJOR" })
  FECHADIETA: Date;

  @Column({ name: "DIEJORNAD" })
  JORNADADIETA: number;

  @Column({ name: "DIEESTADO", default: 1 })
  DIETAESTADO: number;

  @Column({ name: "GENUSUREG" })
  USERREGDIETA: number;

  @CreateDateColumn({ name: "FECHORREG", type: "datetime" })
  FECHAREGDIETA: Date;
}
