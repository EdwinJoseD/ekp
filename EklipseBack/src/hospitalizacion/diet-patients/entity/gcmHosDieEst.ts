import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('GCMHOSDIEEST')
export class DietaEstado {
  @PrimaryGeneratedColumn({ name: 'OID' })
  id: number;

  @Column({ name: 'GCMDIECEN' })
  dietaCentro: number;

  @Column({ name: 'GCMDIEJOR' })
  dietaJornada: number;

  @Column({ name: 'GCMDIEGRU' })
  dietaGrupo: number;

  @Column({ name: 'ADNCENATE' })
  adncenate: number;

  @Column({ name: 'HPNSUBGRU' })
  subgroup: number;

  @Column({ name: 'HPNESTANC' })
  estancia: number;

  @Column({ name: 'DIEFECJOR' })
  fechaDieta: Date;

  @Column({ name: 'DIEJORNAD' })
  jornada: number;

  @Column({ name: 'DIEGRUTIP' })
  tipo: string;

  @Column({ name: 'DIEGRUCON' })
  consistencia: string;

  @Column({ name: 'DIEGRUOBS' })
  observacion: string;

  @Column({ name: 'DIEESTADO' })
  estadoDieta: number;

  @Column({ name: 'DIEESTMOT' })
  estmot: number;

  @Column({ name: 'DIEESTOBS' })
  estobs: string;

  @Column({ name: 'FECHOREST', nullable: true })
  estfecha?: Date;

  //@ManyToOne(() => Users, (user) => user.RegDieEst, { eager: true })
  @Column({ name: 'GENUSUREG' })
  userRegDieta: number;

  @CreateDateColumn({ name: 'FECHORREG', type: 'datetime' })
  fechaRegDieta: Date;
  /* 
  @ManyToOne(() => Users, (user) => user.ActDieEst, { eager: true })
  @JoinColumn({ name: 'GENUSUACT' })
  userActDieta: Users;

  @UpdateDateColumn({ name: 'FECHORACT', type: 'timestamp' })
  fechaActDieta: Date; */
}
