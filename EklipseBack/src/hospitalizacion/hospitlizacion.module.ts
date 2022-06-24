import { Module } from '@nestjs/common';
import { DietPatientsModule } from './diet-patients/diet-patients.module';
import { CensusPatientsModule } from './census-patients/census-patients.module';
import { CensusBedsModule } from './census-beds/census-beds.module';

@Module({
  imports: [DietPatientsModule, CensusPatientsModule, CensusBedsModule],
  exports: [DietPatientsModule],
})
export class HospitlizacionModule {}
