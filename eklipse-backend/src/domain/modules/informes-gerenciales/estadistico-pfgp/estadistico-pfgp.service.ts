import { BaseService } from "src/application/services/base.service";
import { Injectable } from "@nestjs/common";
import * as queries from "./queries";
import { GetConsumidoFacturadoDto } from "./dtos/get-consumido-facturado.dto";
import { GetConsumidoAcostadoDto } from "./dtos/get-consumido-acostado.dto";
import { ConsumidoI } from "./interfaces/consumido.interface";
import { GetAgrupadoresDto } from "./dtos/get-agrupadores.dto";
import { GetHistorialAgrupadoresDto } from "./dtos/get-historial-agrupadores.dto";
import { GetPacientesAgrupadorDto } from "./dtos/get-pacientes-agrupador.dto";
import { GetPacientesAcostadoDto } from "./dtos/get-pacientes-acostado.dto";
import { GetAgrupPaciAcostadoDto } from "./dtos/get-agrup-paci-acostado.dto";
import { GetTotalEjecDiarioDto } from "./dtos/get-total-ejec-diario.dto";
import { GetConsumidoConsolidadoDto } from "./dtos/get-consumido-consolidado.dto";

@Injectable()
export class EstadisticoPfgpService extends BaseService {
  async getConsumidoFacturado(dto: GetConsumidoFacturadoDto) {
    const consumidoFacturado = await queries.getConsumidoFacturado(dto, this.context);
    if (!consumidoFacturado) {
      this.badSuccessRes("No se encrontraron registros en la consulta");
    } else {
      return this.successRes({ consumidoFacturado });
    }
  }
  async getConsumidoAcostado(dto: GetConsumidoAcostadoDto) {
    let consumidoAcostado: ConsumidoI[];
    if (dto.antiguedad === "actual" || dto.antiguedad === "antiguo") {
      if (dto.antiguedad === "actual") {
        consumidoAcostado = await queries.getConsumidoAcostadoActual(dto, this.context);
      }
      if (dto.antiguedad === "antiguo") {
        consumidoAcostado = await queries.getConsumidoAcostadoAntiguo(dto, this.context);
      }
      if (consumidoAcostado[0]) {
        return this.successRes({ consumidoAcostado });
      } else {
        return this.badSuccessRes("No se encontraron registros en la consulta");
      }
    } else {
      return this.badSuccessRes("El campo 'antiguedad' solo permite 'actual'/'antiguo'");
    }
  }
  async getConsumidoConsolidado(dto: GetConsumidoConsolidadoDto) {
    const consumidoConsolidado = await queries.getConsumidoConsolidado(dto, this.context);
    if (consumidoConsolidado[0]) {
      return this.successRes({ consumidoConsolidado });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
  async getAgrupadoresFinales(dto: GetAgrupadoresDto) {
    const agrupadoresFinales = await queries.getAgrupadoresFinales(dto, this.context);
    if (agrupadoresFinales[0]) {
      return this.successRes({ agrupadoresFinales });
    } else {
      return this.badSuccessRes("No existen agrupadores pertenecientes a esta EPS");
    }
  }
  async getHistorialAgrupadores(dto: GetHistorialAgrupadoresDto) {
    const historialAgrupadores = await queries.getHistorialAgrupadores(dto, this.context);
    if (historialAgrupadores[0]) {
      return this.successRes({ historialAgrupadores });
    } else {
      return this.badSuccessRes("Este agrupador no tiene historial");
    }
  }
  async getAgrupadoresContrato(dto: GetTotalEjecDiarioDto) {
    const agrupadoresContrato = await queries.getAgrupadoresContrato(dto, this.context);
    if (agrupadoresContrato[0]) {
      return this.successRes({ agrupadoresContrato });
    } else {
      return this.badSuccessRes("Este contrato no tiene agrupadores");
    }
  }
  async getPacientesAgrupador(dto: GetPacientesAgrupadorDto) {
    const pacientesAgrupador = await queries.getPacientesAgrupador(dto, this.context);
    if (pacientesAgrupador[0]) {
      return this.successRes({ pacientesAgrupador });
    } else {
      return this.badSuccessRes("Este agrupador no tiene pacientes");
    }
  }
  async getServiciosPacientes(dto: GetHistorialAgrupadoresDto) {
    const serviciosPaciente = await queries.getServiciosPacientes(dto, this.context);
    if (serviciosPaciente[0]) {
      return this.successRes({ serviciosPaciente });
    } else {
      return this.badSuccessRes("Este paciente no ha recibido ningún servicio");
    }
  }
  async getServiciosPacienteAcostado(dto: GetAgrupPaciAcostadoDto) {
    const serviciosPaciente = await queries.getServiciosPacienteAcostado(dto, this.context);
    if (serviciosPaciente[0]) {
      return this.successRes({ serviciosPaciente });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
  async getPacientesAcostado(dto: GetPacientesAcostadoDto) {
    let pacientesAcostado: any;
    if (dto.antiguedad === "actual" || dto.antiguedad === "antiguo") {
      pacientesAcostado = await queries.getPacientesAcostado(dto, this.context);
      if (pacientesAcostado[0]) {
        return this.successRes({ pacientesAcostado });
      } else {
        return this.badSuccessRes("No se encontraron registros en la consulta");
      }
    } else {
      return this.badSuccessRes("El campo 'antiguedad' solo permite 'actual'/'antiguo'");
    }
  }
  async getPacientesConsolidado(dto: GetTotalEjecDiarioDto) {
    const pacientesConsolidado = await queries.getPacientesConsolidado(dto, this.context);
    if (pacientesConsolidado[0]) {
      return this.successRes({ pacientesConsolidado });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
  async getAgrupadoresPacienteAcostado(dto: GetAgrupPaciAcostadoDto) {
    const agrupadoresPaciente = await queries.getAgrupadoresPacienteAcostado(dto, this.context);
    if (agrupadoresPaciente[0]) {
      return this.successRes({ agrupadoresPaciente });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
  async getTotalEjecutadoDiario(dto: GetTotalEjecDiarioDto) {
    const totalEjecutado = await queries.GetTotalEjecutadoDiario(dto, this.context);
    if (totalEjecutado[0]) {
      return this.successRes({ totalEjecutado });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
  async getTotalEjecutadoDiarioAsmet(dto: GetTotalEjecDiarioDto) {
    const totalEjecutado = await queries.GetTotalEjecutadoDiarioAsmet(dto, this.context);
    if (totalEjecutado[0]) {
      return this.successRes({ totalEjecutado });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
  async getTotalEjecutadoDiarioAcostado() {
    const nuevaeps = await queries.GetTotalEjecutadoDiarioAcostadoNueva(this.context);
    const asmet8006 = await queries.GetTotalEjecutadoDiarioAcostado8006(this.context);
    const asmet8010 = await queries.GetTotalEjecutadoDiarioAcostado8010(this.context);
    const data = { nuevaeps, asmet8006, asmet8010 };
    if (!data) {
      return this.badSuccessRes("No se encontraron registros en esta consulta");
    } else {
      return this.successRes(data);
    }
  }

  async getDiferenciaConsolidado(dto: GetConsumidoFacturadoDto) {
    const diferenciaConsolidado = await queries.getDiferenciaConsolidado(dto, this.context);
    if (diferenciaConsolidado[0]) {
      return this.successRes({ diferenciaConsolidado });
    } else {
      return this.badSuccessRes("No se encontraron registros en la consulta");
    }
  }
}
