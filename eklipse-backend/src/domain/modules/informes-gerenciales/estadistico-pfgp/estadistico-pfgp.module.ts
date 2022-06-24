import { Module } from "@nestjs/common";
import { EstadisticoPfgpService } from "./estadistico-pfgp.service";
import { EstadisticoPfgpController } from "./estadistico-pfgp.controller";

@Module({
  controllers: [EstadisticoPfgpController],
  providers: [EstadisticoPfgpService],
})
export class EstadisticoPfgpModule {}
