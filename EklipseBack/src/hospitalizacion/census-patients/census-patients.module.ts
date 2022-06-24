import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CensusPatientsController } from './census-patients.controller';
import { CensusPatientsService } from './census-patients.service';
import { CensoPacientes } from './entity/censoPaciente.entity';
import { CensusPatientsRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CensoPacientes], 'AC'),
    TypeOrmModule.forFeature([CensoPacientes], 'SJ'),
    TypeOrmModule.forFeature([CensoPacientes], 'VDP'),
    TypeOrmModule.forFeature([CensoPacientes], 'AGU'),
    AuthModule,
  ],
  controllers: [CensusPatientsController],
  providers: [CensusPatientsService, CensusPatientsRepository],
})
export class CensusPatientsModule {}
