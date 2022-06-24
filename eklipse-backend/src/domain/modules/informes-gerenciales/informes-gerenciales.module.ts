import { Module } from "@nestjs/common";
import { EstadisticoPfgpModule } from "./estadistico-pfgp/estadistico-pfgp.module";
import { RadicacionFacturacionModule } from "./radicacion-facturacion/radicacion-facturacion.module";

@Module({
  imports: [RadicacionFacturacionModule, EstadisticoPfgpModule],
  exports: [RadicacionFacturacionModule, EstadisticoPfgpModule],
})
export class InformesGerencialesModule {}
