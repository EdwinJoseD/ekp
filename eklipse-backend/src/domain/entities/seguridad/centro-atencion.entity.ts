import { Entity, Column } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("ADNCENATE")
export class CentroAtencionEntity extends BaseEntity {
  @Column({ name: "ACACODIGO" })
  CODIGO: number;

  @Column({ name: "ACANOMBRE" })
  NOMBRE: string;
}
