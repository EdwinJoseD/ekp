import { Entity, Column } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity("GENUSUARIO")
export class UsuarioEntity extends BaseEntity {
  @Column({ name: "GENROL" })
  roleId: number;

  @Column({ name: "USUNOMBRE" })
  identification: string;

  @Column({ name: "USUCLAVE", select: false })
  password: string;

  @Column({ name: "USUDESCRI" })
  name: string;

  @Column({ name: "USUESTADO" })
  status: number;
}
