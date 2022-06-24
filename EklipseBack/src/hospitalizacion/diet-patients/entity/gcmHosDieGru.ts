import { Users } from 'src/users/entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('GCMHOSDIEGRU')
export class DietaGrupo {
  @PrimaryGeneratedColumn({ name: 'OID' })
  id: number;

  @Column({ name: 'GCMDIECEN' })
  dietaCentro: number;

  @Column({ name: 'GCMDIEJOR' })
  dietaJornada: number;

  @Column({ name: 'ADNCENATE' })
  adncenate: number;

  @Column({ name: 'HPNSUBGRU' })
  subgroup: number;

  @Column({ name: 'DIEFECJOR' })
  fechaDieta: Date;

  @Column({ name: 'DIEJORNAD' })
  jornada: number;

  @Column({ name: 'DIEESTADO' })
  estadoDieta: number;

  //@ManyToOne(() => Users, (user) => user.RegDieGru, { eager: true })
  @Column({ name: 'GENUSUREG' })
  userRegDieta: number;

  @CreateDateColumn({ name: 'FECHORREG', type: 'datetime' })
  fechaRegDieta: Date;

  /* 
  @ManyToOne(() => Users, (user) => user.ActDieGru, { eager: true })
  @JoinColumn({ name: 'GENUSUACT' })
  userActDieta: Users;

  @UpdateDateColumn({ name: 'FECHORACT', type: 'timestamp' })
  fechaActDieta: Date; */
}
