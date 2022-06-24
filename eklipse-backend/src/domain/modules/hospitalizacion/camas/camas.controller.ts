import { Controller, Get, Param } from "@nestjs/common";
import { CamasService } from "./camas.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { GetCensoGrupocamasDto } from "./dtos/get-censo-grupo-camas.dto";
import { GetSubgruposCamasDto } from "./dtos/get-subgs-camas.dto";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("hospitalizacion/camas")
@Controller("camas")
export class CamasController {
  constructor(private readonly camasService: CamasService) {}

  @Get()
  getCamas() {
    return this.camasService.getCamas();
  }

  @Get("censo")
  getCensoCamas() {
    return this.camasService.getCensoCamas();
  }

  @Get("censo/:grupo")
  getCensoGrupoCamas(@Param() dto: GetCensoGrupocamasDto) {
    return this.camasService.getCensoGrupoCamas(dto);
  }

  @Get("subgrupos/:centroAtencion")
  getSubgruposCamas(@Param() dto: GetSubgruposCamasDto) {
    return this.camasService.getSubgruposCamas(dto);
  }
}
