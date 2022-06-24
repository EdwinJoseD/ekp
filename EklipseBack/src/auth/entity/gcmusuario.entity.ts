import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('GCMUSUARIO')
export class GcmUsuario {
  @PrimaryGeneratedColumn({ name: 'OID' })
  id?: number;

  @Column({ name: 'GENUSUARIO' })
  idUsuario: number;

  @UpdateDateColumn({ name: 'FECHORCON' })
  ultimaConexion: Date;

  @Column({ name: 'TOKEN' })
  token: string;
}
