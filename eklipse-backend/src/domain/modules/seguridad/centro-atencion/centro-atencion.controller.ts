import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CentroAtencionService } from "./centro-atencion.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("seguridad/centro-atencion")
@Controller("centro-atencion")
export class CentroAtencionController {
  constructor(private readonly centroAtencionService: CentroAtencionService) {}

  @Get()
  findAll() {
    return this.centroAtencionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.centroAtencionService.findOne(+id);
  }
}
