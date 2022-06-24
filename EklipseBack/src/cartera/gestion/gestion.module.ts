import { Module } from '@nestjs/common';
import { GestionService } from './gestion.service';
import { GestionController } from './gestion.controller';
import { GestionRepository } from './repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConciliacionModule } from '../conciliacion/conciliacion.module';
import { GestionCarteraEntity } from './entity';
import { ConciliacionCarteraEntity } from '../conciliacion/entity';
import { ConciliacionRepository } from '../conciliacion/repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [GestionCarteraEntity, ConciliacionCarteraEntity],
      'AC'
    ),
    //TypeOrmModule.forFeature([], 'AGU'),
    //TypeOrmModule.forFeature([], 'VDP'),
    //TypeOrmModule.forFeature([], 'SJ'),
    AuthModule,
    ConciliacionModule,
  ],
  providers: [GestionService, GestionRepository, ConciliacionRepository],
  controllers: [GestionController],
})
export class GestionModule {}
