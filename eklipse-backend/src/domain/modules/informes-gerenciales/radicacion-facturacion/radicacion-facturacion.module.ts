import { Module } from "@nestjs/common";
import { RadicacionFacturacionService } from "./radicacion-facturacion.service";
import { RadicacionFacturacionController } from "./radicacion-facturacion.controller";

@Module({
  controllers: [RadicacionFacturacionController],
  providers: [RadicacionFacturacionService],
})
export class RadicacionFacturacionModule {}
