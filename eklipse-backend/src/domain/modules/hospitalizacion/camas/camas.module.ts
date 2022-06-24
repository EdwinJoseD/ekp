import { Module } from "@nestjs/common";
import { CamasService } from "./camas.service";
import { CamasController } from "./camas.controller";

@Module({
  controllers: [CamasController],
  providers: [CamasService],
})
export class CamasModule {}
