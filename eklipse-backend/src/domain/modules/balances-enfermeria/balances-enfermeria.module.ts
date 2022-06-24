import { Module } from "@nestjs/common";
import { SabanasUciModule } from "./sabanas-uci/sabanas-uci.module";

@Module({
  imports: [SabanasUciModule],
  exports: [SabanasUciModule],
})
export class BalancesEnfermeriaModule {}
