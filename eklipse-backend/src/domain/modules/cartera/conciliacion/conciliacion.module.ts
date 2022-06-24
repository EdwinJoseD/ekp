import { Module } from "@nestjs/common";
import { ConciliacionService } from "./conciliacion.service";
import { ConciliacionController } from "./conciliacion.controller";
import { AuthModule } from "../../seguridad/auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [ConciliacionService],
  controllers: [ConciliacionController],
})
export class ConciliacionModule {}
