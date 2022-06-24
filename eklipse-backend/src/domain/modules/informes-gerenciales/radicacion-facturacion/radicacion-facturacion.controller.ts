import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { RadicacionFacturacionService } from "./radicacion-facturacion.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { GetRadicacionPorContratoDto } from "./dtos/get-radicacion-por-contrato.dto";
import { GetFacturasSinRadicarDto } from "./dtos/get-facturas-sin-radicar.dto";
import { GetInfoGeneralDto } from "./dtos/get-info-general.dto";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("informes-gerenciales/radicacion-facturacion")
@Controller("radicacion-facturacion")
export class RadicacionFacturacionController {
  constructor(private readonly radicacionFacturacionService: RadicacionFacturacionService) {}

  @Get("info-general/:inicioReporte/:finalReporte/:centro1/:centro2")
  getInformacionGeneral(@Param() dto: GetInfoGeneralDto) {
    return this.radicacionFacturacionService.getInformacionGeneral(dto);
  }

  @Get("facturas-sin-radicar")
  getFacturasSinRadicar() {
    return this.radicacionFacturacionService.getFacturasSinRadicar();
  }

  @Get("facturas-sin-radicar/:inicioReporte/:finalReporte")
  getFacturasSinRadicarPorFecha(@Param() dto: GetFacturasSinRadicarDto) {
    return this.radicacionFacturacionService.getFacturasSinRadicar(dto);
  }

  @Get(":contrato/:inicioReporte/:finalReporte")
  getRadicacionPorContrato(@Param() dto: GetRadicacionPorContratoDto) {
    return this.radicacionFacturacionService.getRadicacionPorContrato(dto);
  }
}
