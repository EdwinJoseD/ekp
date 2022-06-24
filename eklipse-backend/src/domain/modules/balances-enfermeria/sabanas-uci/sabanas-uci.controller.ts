import { Controller, Get, Param } from "@nestjs/common";
import { SabanasUciService } from "./sabanas-uci.service";
import { GetEstanciasPacienteDto } from "./dtos/get-estancias-paciente.dto";
import { GetSabanasUCiMultiDto } from "./dtos/get-sabanas-uci-multi.dto";
import { GetSabanasUCiDto } from "./dtos/get-sabanas-uci.dto";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "src/application/decorators/auth.decorator";

@Auth()
@ApiTags("balances-enfermeria/sabanas-uci")
@Controller("sabanas-uci")
export class SabanasUciController {
  constructor(private readonly sabanasUciService: SabanasUciService) {}

  @Get("reporte-individual/:ingreso/:fecha")
  getSabanasUci(@Param() dto: GetSabanasUCiDto) {
    return this.sabanasUciService.getSabanasUci(dto);
  }

  @Get("reporte-multiple/:ingreso/:inicioReporte/:finalReporte")
  getSabanasUciMulti(@Param() dto: GetSabanasUCiMultiDto) {
    return this.sabanasUciService.getSabanasUciMulti(dto);
  }

  @Get("pacientes-sin-peso")
  getPacientesSinPeso() {
    return this.sabanasUciService.getPacientesSinPeso();
  }

  @Get("estancias-paciente/:ingreso")
  getEstanciasPaciente(@Param() dto: GetEstanciasPacienteDto) {
    return this.sabanasUciService.getEstanciasPaciente(dto);
  }
}
