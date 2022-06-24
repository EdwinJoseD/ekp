import { Users } from 'src/users/entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('GCMHOSDIECEN')
export class DietaCentro {
  @PrimaryGeneratedColumn({ name: 'OID' })
  oid: number;

  @PrimaryGeneratedColumn({ name: 'ADNCENATE' })
  adncenate: number;

  @Column({ name: 'DIEFECJOR' })
  fechaDieta: Date;

  @Column({ name: 'DIEJORDES', default: null })
  dietaDesayuno: number;

  @Column({ name: 'DIEJORALM', default: null })
  dietaAlmuerzo: number;

  @Column({ name: 'DIEJORCEN', default: null })
  dietaCena: number;

  @Column({ name: 'DIEESTADO' })
  dietaEstado: number;

  //@ManyToOne(() => Users, (user) => user.RegDieCen, { eager: true })
  @Column({ name: 'GENUSUREG' })
  userRegDieta: number;

  @CreateDateColumn({ name: 'FECHORREG', type: 'datetime' })
  fechaRegDieta: Date;

  /*
  @ManyToOne(() => Users, (user) => user.ActDieCen, { eager: true })
  @JoinColumn({ name: 'GENUSUACT' })
  userActDieta: Users;

  @UpdateDateColumn({ name: 'FECHORACT', type: 'timestamp' })
  fechaActDieta: Date; */
}
