//import { GcmPermiso, GcmRolPermiso } from 'src/auth/entity';
import { DietaCentro } from 'src/hospitalizacion/diet-patients/entity/gcmHosDieCen';
import { DietaEstado } from 'src/hospitalizacion/diet-patients/entity/gcmHosDieEst';
import { DietaGrupo } from 'src/hospitalizacion/diet-patients/entity/gcmHosDieGru';
import { DietaJornada } from 'src/hospitalizacion/diet-patients/entity/gcmHosDieJor';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('GENUSUARIO')
export class Users {
  @PrimaryGeneratedColumn({ name: 'OID' })
  id: number;

  @Column({ name: 'GENROL' })
  idRol: number;

  @Column({ name: 'USUNOMBRE' })
  identification: string;

  @Column({ name: 'USUDESCRI' })
  user: string;

  @Column({ name: 'USUCLAVE', select: false })
  password: string;

  @Column({ name: 'USUESTADO' })
  status: number;

  /* @OneToOne((_) => DietaCentro, (diecen) => diecen.userRegDieta, {
    cascade: true,
  })
  RegDieCen?: DietaCentro;

  @OneToOne((_) => DietaCentro, (diecen) => diecen.userActDieta, {
    cascade: true,
  })
  ActDieCen?: DietaCentro;

  @OneToOne((_) => DietaEstado, (dieest) => dieest.userRegDieta, {
    cascade: true,
  })
  RegDieEst?: DietaEstado;

  @OneToOne((_) => DietaEstado, (dieest) => dieest.userActDieta, {
    cascade: true,
  })
  ActDieEst?: DietaEstado;

  @OneToOne((_) => DietaGrupo, (diegru) => diegru.userRegDieta, {
    cascade: true,
  })
  RegDieGru?: DietaGrupo;

  @OneToOne((_) => DietaGrupo, (diegru) => diegru.userActDieta, {
    cascade: true,
  })
  ActDieGru?: DietaGrupo;

  @OneToOne((_) => DietaJornada, (diejor) => diejor.userRegDieta, {
    cascade: true,
  })
  RegDieJor?: DietaJornada;

  @OneToOne((_) => DietaJornada, (diejor) => diejor.userActDieta, {
    cascade: true,
  })
  ActDieJor?: DietaJornada; */

  // @OneToOne((_) => GcmRolPermiso, (userper) => userper.userRegRolPermiso, {
  //   cascade: true,
  // })
  // RegRolPermiso: GcmRolPermiso;

  // @OneToOne((_) => GcmRolPermiso, (userper) => userper.userActRolPermiso, {
  //   cascade: true,
  // })
  // ActRolPermiso: GcmRolPermiso;

  // @OneToOne((_) => GcmPermiso, (userper) => userper.userRegPermiso, {
  //   cascade: true,
  // })
  // RegPermiso: GcmPermiso;

  // @OneToOne((_) => GcmPermiso, (userper) => userper.userActPermiso, {
  //   cascade: true,
  // })
  // ActPermiso: GcmPermiso;
}
