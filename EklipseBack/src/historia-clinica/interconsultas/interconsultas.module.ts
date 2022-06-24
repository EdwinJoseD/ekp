import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InterconsultasController } from './interconsultas.controller';
import { InterconsultasService } from './interconsultas.service';
import { InterconsultasRepository } from './repository';

@Module({
  controllers: [InterconsultasController],
  providers: [InterconsultasService, InterconsultasRepository],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'SJ'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'AGU'),
  ],
})
export class InterconsultasModule {}
