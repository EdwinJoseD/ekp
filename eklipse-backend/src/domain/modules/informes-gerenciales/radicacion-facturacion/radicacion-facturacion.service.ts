import { BaseService } from "src/application/services/base.service";
import { Injectable } from "@nestjs/common";
import * as queries from "./queries";
import { GetRadicacionPorContratoDto } from "./dtos/get-radicacion-por-contrato.dto";
import { GetFacturasSinRadicarDto } from "./dtos/get-facturas-sin-radicar.dto";
import { GetInfoGeneralDto } from "./dtos/get-info-general.dto";

@Injectable()
export class RadicacionFacturacionService extends BaseService {
  async getInformacionGeneral(dto: GetInfoGeneralDto) {
    const resumen = await queries.getResumen(dto, this.context);
    const radicacionDiaria = await queries.getRadicacionDiaria(dto, this.context);
    const radicacionAcumulada = await queries.getRadicacionAcumulada(dto, this.context);
    const radicacionPendiente = await queries.getRadicacionPendiente(dto, this.context);
    const radPorDocumentos = await queries.getRadPorDocumentos(dto, this.context);
    const radPorEstado = await queries.getRadPorEstado(dto, this.context);
    const radPorEntidades = await queries.getRadPorEntidades(dto, this.context);
    const radPorUsuario = await queries.getRadPorUsuario(dto, this.context);
    const radUsuarioPorEntidad = await queries.getRadUsuarioPorEntidad(dto, this.context);
    return this.successRes({
      resumen,
      radicacionDiaria,
      radicacionAcumulada,
      radicacionPendiente,
      radPorDocumentos,
      radPorEstado,
      radPorEntidades,
      radPorUsuario,
      radUsuarioPorEntidad,
    });
  }
  async getFacturasSinRadicar(dto: GetFacturasSinRadicarDto = null) {
    const facturasSinRadicar = await queries.getFacturasSinRadicar(this.context, dto);
    if (facturasSinRadicar[0]) {
      return this.successRes({ facturasSinRadicar }, "Facturas Pendientes Por Radicar");
    } else {
      return this.badSuccessRes("No hay facturas pendientes por radicar");
    }
  }
  async getRadicacionPorContrato(dto: GetRadicacionPorContratoDto) {
    const radicaciones = await queries.getRadicacionPorContrato(dto, this.context);
    if (radicaciones) {
      return this.successRes({ radicaciones });
    } else {
      return this.badSuccessRes("No hay radicaciones relacionadas con este contrato");
    }
  }
}
