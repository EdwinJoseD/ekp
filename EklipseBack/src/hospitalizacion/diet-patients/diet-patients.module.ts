import { Module } from '@nestjs/common';
import { DietPatientsService } from './diet-patients.service';
import { DietPatientsController } from './diet-patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsRepository } from './repository/patients.repository';
import { AuthModule } from 'src/auth/auth.module';
import { DietaCentroRepository } from './repository/gcmHosDieCen.repository';
import { DietaGrupoRepository } from './repository/gcmHosDieGru.repository';
import { DietaJornadaRepository } from './repository/gcmHosDieJor.repository';
import { DietaEstadoRepository } from './repository/gcmHosDieEst.repository';
import { CenterOfAttentionModule } from 'src/center-of-attention/center-of-attention.module';
import { DietaCentro, DietaEstado, DietaGrupo, DietaJornada } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [DietaEstado, DietaJornada, DietaCentro, DietaGrupo],
      'AC'
    ),
    TypeOrmModule.forFeature(
      [DietaEstado, DietaJornada, DietaCentro, DietaGrupo],
      'SJ'
    ),
    TypeOrmModule.forFeature(
      [DietaEstado, DietaJornada, DietaCentro, DietaGrupo],
      'VDP'
    ),
    TypeOrmModule.forFeature(
      [DietaEstado, DietaJornada, DietaCentro, DietaGrupo],
      'AGU'
    ),
    AuthModule,
  ],
  providers: [
    DietPatientsService,
    PatientsRepository,
    DietaCentroRepository,
    DietaGrupoRepository,
    DietaJornadaRepository,
    DietaEstadoRepository,
    CenterOfAttentionModule,
  ],
  controllers: [DietPatientsController],
  exports: [DietaEstadoRepository],
})
export class DietPatientsModule {}
