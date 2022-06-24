import { Module } from "@nestjs/common";
import { ConceptosAdmisionService } from "./conceptos-admision.service";
import { ConceptosAdmisionController } from "./conceptos-admision.controller";

@Module({
  controllers: [ConceptosAdmisionController],
  providers: [ConceptosAdmisionService],
})
export class ConceptosAdmisionModule {}
