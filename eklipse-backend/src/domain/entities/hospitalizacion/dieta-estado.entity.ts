import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("GCMHOSDIEEST")
export class DietaEstadoEntity extends BaseEntity {
  @Column({ name: "GCMDIECEN" })
  DIETACENTRO: number;

  @Column({ name: "GCMDIEJOR" })
  DIETAJORNADA: number;

  @Column({ name: "GCMDIEGRU" })
  DIETAGRUPO: number;

  @Column({ name: "ADNCENATE" })
  CENTROATENCION: number;

  @Column({ name: "HPNSUBGRU" })
  SUBGRUPO: number;

  @Column({ name: "HPNESTANC" })
  ESTANCIA: number;

  @Column({ name: "DIEFECJOR" })
  FECHADIETA: Date;

  @Column({ name: "DIEJORNAD" })
  JORNADA: number;

  @Column({ name: "DIEGRUTIP" })
  TIPO: string;

  @Column({ name: "DIEGRUCON" })
  CONSISTENCIA: string;

  @Column({ name: "DIEGRUOBS" })
  OBSERVACION: string;

  @Column({ name: "DIEESTADO" })
  ESTADODIETA: number;

  @Column({ name: "DIEESTMOT" })
  ESTMOT: number;

  @Column({ name: "DIEESTOBS" })
  ESTOBS: string;

  @Column({ name: "FECHOREST", nullable: true })
  ESTFECHA?: Date;

  @Column({ name: "GENUSUREG" })
  USERREGDIETA: number;

  @CreateDateColumn({ name: "FECHORREG", type: "datetime" })
  FECHAREGDIETA: Date;
}
