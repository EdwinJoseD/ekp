import { Controller, Get } from "@nestjs/common";
import { PacientesService } from "./pacientes.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("hospitalizacion/pacientes")
@Controller("pacientes")
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get("censo")
  getInterconsultasPendientes() {
    return this.pacientesService.getPendientes();
  }
}
