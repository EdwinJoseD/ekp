import { Controller, Get, Param } from "@nestjs/common";
import { EstadisticoPfgpService } from "./estadistico-pfgp.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { ApiTags } from "@nestjs/swagger";
import { GetConsumidoConsolidadoDto } from "./dtos/get-consumido-consolidado.dto";
import { GetHistorialAgrupadoresDto } from "./dtos/get-historial-agrupadores.dto";
import { GetPacientesAgrupadorDto } from "./dtos/get-pacientes-agrupador.dto";
import { GetConsumidoFacturadoDto } from "./dtos/get-consumido-facturado.dto";
import { GetAgrupPaciAcostadoDto } from "./dtos/get-agrup-paci-acostado.dto";
import { GetPacientesAcostadoDto } from "./dtos/get-pacientes-acostado.dto";
import { GetConsumidoAcostadoDto } from "./dtos/get-consumido-acostado.dto";
import { GetTotalEjecDiarioDto } from "./dtos/get-total-ejec-diario.dto";
import { GetAgrupadoresDto } from "./dtos/get-agrupadores.dto";

@Auth()
@ApiTags("informes-gerenciales/estadistico-pfgp")
@Controller("pfgp")
export class EstadisticoPfgpController {
  constructor(private readonly estadisticoPfgpService: EstadisticoPfgpService) {}

  @Get("consumido-facturado/:inicioReporte/:finalReporte/:centro1/:centro2")
  getConsumidoFacturado(@Param() dto: GetConsumidoFacturadoDto) {
    return this.estadisticoPfgpService.getConsumidoFacturado(dto);
  }

  @Get("consumido-acostado/:antiguedad/:centro1/:centro2")
  getConsumidoAcostado(@Param() dto: GetConsumidoAcostadoDto) {
    return this.estadisticoPfgpService.getConsumidoAcostado(dto);
  }

  @Get("consumido-consolidado/:inicioReporte/:finalReporte")
  getConsumidoConsolidado(@Param() dto: GetConsumidoConsolidadoDto) {
    return this.estadisticoPfgpService.getConsumidoConsolidado(dto);
  }

  @Get("paci-acostados/:antiguedad/:centro1/:centro2/:contrato")
  getPacientesAcostados(@Param() dto: GetPacientesAcostadoDto) {
    return this.estadisticoPfgpService.getPacientesAcostado(dto);
  }

  @Get("agrup-finales/:inicioReporte/:finalReporte/:centro1/:centro2/:contrato1/:contrato2")
  getAgrupadoresFinales(@Param() dto: GetAgrupadoresDto) {
    return this.estadisticoPfgpService.getAgrupadoresFinales(dto);
  }

  @Get("historial-agrup/:inicioReporte/:finalReporte/:contrato/:ingreso")
  getHistorialAgrupadores(@Param() dto: GetHistorialAgrupadoresDto) {
    return this.estadisticoPfgpService.getHistorialAgrupadores(dto);
  }

  @Get("agrup-contrato/:inicioReporte/:finalReporte/:contrato")
  getAgrupadoresContrato(@Param() dto: GetTotalEjecDiarioDto) {
    return this.estadisticoPfgpService.getAgrupadoresContrato(dto);
  }

  @Get("paci-agrup/:inicioReporte/:finalReporte/:centro1/:centro2/:contrato1/:contrato2/:agrupador")
  getPacientesAgrupador(@Param() dto: GetPacientesAgrupadorDto) {
    return this.estadisticoPfgpService.getPacientesAgrupador(dto);
  }

  @Get("paci-consolidado/:inicioReporte/:finalReporte/:contrato")
  getPacientesConsolidado(@Param() dto: GetTotalEjecDiarioDto) {
    return this.estadisticoPfgpService.getPacientesConsolidado(dto);
  }

  @Get("agrup-paci-acostado/:contrato/:ingreso")
  getAgrupadoresPacienteAcostado(@Param() dto: GetAgrupPaciAcostadoDto) {
    return this.estadisticoPfgpService.getAgrupadoresPacienteAcostado(dto);
  }

  @Get("servi-paci/:inicioReporte/:finalReporte/:contrato/:ingreso")
  getServiciosPacientes(@Param() dto: GetHistorialAgrupadoresDto) {
    return this.estadisticoPfgpService.getServiciosPacientes(dto);
  }

  @Get("servi-paci-acostado/:contrato/:ingreso")
  getServiciosPacienteAcostado(@Param() dto: GetAgrupPaciAcostadoDto) {
    return this.estadisticoPfgpService.getServiciosPacienteAcostado(dto);
  }

  @Get("total-ejec-diario/:inicioReporte/:finalReporte/:contrato")
  getTotalEjecutadoDiario(@Param() dto: GetTotalEjecDiarioDto) {
    return this.estadisticoPfgpService.getTotalEjecutadoDiario(dto);
  }

  @Get("total-ejec-diario-asmet/:inicioReporte/:finalReporte/:contrato")
  getTotalEjecutadoDiarioAsmet(@Param() dto: GetTotalEjecDiarioDto) {
    return this.estadisticoPfgpService.getTotalEjecutadoDiarioAsmet(dto);
  }

  @Get("total-ejec-diario-acostado")
  getTotalEjecutadoDiarioAcostado() {
    return this.estadisticoPfgpService.getTotalEjecutadoDiarioAcostado();
  }

  @Get("diferencia-consolidado/:inicioReporte/:finalReporte/:centro1/:centro2")
  getDiferenciaConsolidado(@Param() dto: GetConsumidoFacturadoDto) {
    return this.estadisticoPfgpService.getDiferenciaConsolidado(dto);
  }
}
