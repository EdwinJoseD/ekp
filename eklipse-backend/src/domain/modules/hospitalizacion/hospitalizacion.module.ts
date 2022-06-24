import { Module } from "@nestjs/common";
import { CamasModule } from "./camas/camas.module";
import { DietasModule } from "./dietas/dietas.module";
import { PacientesModule } from "./pacientes/pacientes.module";

@Module({
  imports: [CamasModule, DietasModule, PacientesModule],
  exports: [CamasModule, DietasModule, PacientesModule],
})
export class HospitalizacionModule {}
