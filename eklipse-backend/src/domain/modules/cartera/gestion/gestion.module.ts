import { Module } from "@nestjs/common";
import { GestionService } from "./gestion.service";
import { GestionController } from "./gestion.controller";
import { ConciliacionModule } from "../conciliacion/conciliacion.module";
import { AuthModule } from "../../seguridad/auth/auth.module";

@Module({
  imports: [AuthModule, ConciliacionModule],
  providers: [GestionService],
  controllers: [GestionController],
})
export class GestionModule {}
