import { Module } from "@nestjs/common";
import { EpicrisisModule } from "./epicrisis/epicrisis.module";
import { InterconsultasModule } from "./interconsultas/interconsultas.module";

@Module({
  imports: [EpicrisisModule, InterconsultasModule],
  exports: [EpicrisisModule, InterconsultasModule],
})
export class HistoriaClinicaModule {}
