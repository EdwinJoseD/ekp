import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ADNCENATE')
export class CenterAttention {
  @PrimaryGeneratedColumn({ name: 'OID' })
  id: number;

  @Column({ name: 'ACACODIGO' })
  codigo: number;

  @Column({ name: 'ACANOMBRE' })
  centroAtencion: string;
}
