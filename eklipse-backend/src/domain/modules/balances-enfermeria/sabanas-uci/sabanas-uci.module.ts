import { Module } from "@nestjs/common";
import { SabanasUciService } from "./sabanas-uci.service";
import { SabanasUciController } from "./sabanas-uci.controller";

@Module({
  controllers: [SabanasUciController],
  providers: [SabanasUciService],
})
export class SabanasUciModule {}
