import { Controller, Get, Param } from "@nestjs/common";
import { EpicrisisService } from "./epicrisis.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { EpicrisisDto } from "./dtos/epicrisis.dto";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("historia-clinica/epicrisis")
@Controller("epicrisis")
export class EpicrisisController {
  constructor(private readonly EpicrisisService: EpicrisisService) {}

  @Get(":consecutivo")
  getEpicrisis(@Param() dto: EpicrisisDto) {
    return this.EpicrisisService.getEpicrisis(dto);
  }

  @Get("desconfirmar/:consecutivo")
  desconfirmarEpicrisis(@Param() dto: EpicrisisDto) {
    return this.EpicrisisService.desconfirmarEpicrisis(dto);
  }
}
