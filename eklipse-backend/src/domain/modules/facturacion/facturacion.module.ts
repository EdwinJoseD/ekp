import { Module } from "@nestjs/common";
import { ConceptosAdmisionModule } from "./conceptos-admision/conceptos-admision.module";

@Module({
  imports: [ConceptosAdmisionModule],
  exports: [ConceptosAdmisionModule],
})
export class FacturacionModule {}
