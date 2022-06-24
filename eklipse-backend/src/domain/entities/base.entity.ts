import { PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn({ name: "OID" })
  ID?: number;
}
