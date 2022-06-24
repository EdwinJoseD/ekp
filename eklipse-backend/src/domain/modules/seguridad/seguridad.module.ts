import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CentroAtencionModule } from "./centro-atencion/centro-atencion.module";

@Module({
  imports: [AuthModule, CentroAtencionModule],
  exports: [AuthModule, CentroAtencionModule],
})
export class SeguridadModule {}
