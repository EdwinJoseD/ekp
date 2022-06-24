import { Module } from '@nestjs/common';
import { DesconfirmarEpicrisisModule } from './desconfirmar-epicrisis/desconfirmar-epicrisis.module';
import { InterconsultasModule } from './interconsultas/interconsultas.module';

@Module({
  imports: [DesconfirmarEpicrisisModule, InterconsultasModule],
  exports: [DesconfirmarEpicrisisModule, InterconsultasModule],
})
export class HistoriaClinicaModule {}
