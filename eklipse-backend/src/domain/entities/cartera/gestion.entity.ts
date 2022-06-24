import { Entity, Column, CreateDateColumn } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("GCMGESCART")
export class GestionEntity extends BaseEntity {
  @Column({ name: "GENUSUARIO", type: "integer" })
  GENUSUARIO: number;

  @CreateDateColumn({ name: "FECHA", type: "datetimeoffset" })
  FECHA: Date;

  @Column({ name: "GENTERCER", type: "integer" })
  GENTERCER: number;

  @Column({ name: "TELEFTERC", type: "nvarchar" })
  TELEFTERC: string;

  @Column({ name: "RESPTERC", type: "nvarchar" })
  RESPTERC: string;

  @Column({ name: "MOTLLAMAD", type: "nvarchar" })
  MOTLLAMAD: string;

  @Column({ name: "OBSERVACION", type: "text" })
  OBSERVACION: string;

  @CreateDateColumn({ name: "FECHCONCI", type: "datetimeoffset" })
  FECHCONCI!: Date;

  @Column({ name: "TIPCONCI", type: "nvarchar", default: null })
  TIPCONCI: string;
}
