import { Module } from "@nestjs/common";
import { DietasService } from "./dietas.service";
import { DietasController } from "./dietas.controller";

@Module({
  controllers: [DietasController],
  providers: [DietasService],
})
export class DietasModule {}
