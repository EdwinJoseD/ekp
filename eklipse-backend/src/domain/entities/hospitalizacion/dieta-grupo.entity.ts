import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("GCMHOSDIEGRU")
export class DietaGrupoEntity extends BaseEntity {
  @Column({ name: "GCMDIECEN" })
  DIETACENTRO: number;

  @Column({ name: "GCMDIEJOR" })
  DIETAJORNADA: number;

  @Column({ name: "DIEJORNAD" })
  JORNADADIETA: number;

  @Column({ name: "ADNCENATE" })
  CENTROATENCION: number;

  @Column({ name: "HPNSUBGRU" })
  SUBGRUPO: number;

  @Column({ name: "DIEFECJOR" })
  FECHADIETA: Date;

  @Column({ name: "DIEESTADO" })
  ESTADODIETA: number;

  @Column({ name: "GENUSUREG" })
  USERREGDIETA: number;

  @CreateDateColumn({ name: "FECHORREG", type: "datetime" })
  FECHAREGDIETA: Date;
}
