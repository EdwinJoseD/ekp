import { Controller, Get } from "@nestjs/common";
import { InterconsultasService } from "./interconsultas.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("historia-clinica/interconsultas")
@Controller("interconsultas")
export class InterconsultasController {
  constructor(private readonly interconsultasService: InterconsultasService) {}

  @Get("pendientes")
  getInterconsultasPendientes() {
    return this.interconsultasService.getInterconsultasPendientes();
  }
}
