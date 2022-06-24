import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('GCMHOSDIEJOR')
export class DietaJornada {
  @PrimaryGeneratedColumn({ name: 'OID' })
  id: number;

  @Column({ name: 'GCMDIECEN' })
  dietaCentro: number;

  @Column({ name: 'ADNCENATE' })
  adncenate: number;

  @Column({ name: 'DIEFECJOR' })
  fechaDieta: Date;

  @Column({ name: 'DIEJORNAD' })
  dietaJornada: number;

  @Column({ name: 'DIEESTADO', default: 1 })
  dietaEstado: number;

  public readonly DESAYUNO = 1;
  public readonly ALMUERZO = 2;
  public readonly CENA = 3;

  public getJornada(): string {
    switch (this.dietaJornada) {
      case this.DESAYUNO:
        return 'DESAYUNO';
      case this.ALMUERZO:
        return 'ALMUERZO';
      case this.CENA:
        return 'CENA';
      default:
        return 'INDEFINIDO';
    }
  }

  public getCenter() {
    switch (this.adncenate) {
      case 1:
        return 'MEDICO CENTRO';
      case 2:
        return 'ALTA COMPLEJIDAD DEL CARIBE';
      default:
        return '';
    }
  }

  // @ManyToOne(() => Users, (user) => user.RegDieJor, { eager: true })
  @Column({ name: 'GENUSUREG' })
  userRegDieta: number;

  @CreateDateColumn({ name: 'FECHORREG', type: 'datetime' })
  fechaRegDieta: Date;

  /*
  @ManyToOne(() => Users, (user) => user.ActDieJor, { eager: true })
  @JoinColumn({ name: 'GENUSUACT' })
  userActDieta: Users;

  @UpdateDateColumn({ name: 'FECHORACT', type: 'timestamp' })
  fechaActDieta: Date; */
}
