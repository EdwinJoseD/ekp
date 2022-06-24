import { BaseService } from "src/application/services/base.service";
import { Injectable } from "@nestjs/common";
import * as queries from "./queries";
import { GetEstanciasPacienteDto } from "./dtos/get-estancias-paciente.dto";
import { GetSabanasUCiMultiDto } from "./dtos/get-sabanas-uci-multi.dto";
import { GetSabanasUCiDto } from "./dtos/get-sabanas-uci.dto";
import { EstanciaPacienteI } from "./interfaces/estancia-paciente.interface";
import { ResponseI } from "src/application/interfaces/response.interface";
import { LiquidosAbreviadosI } from "./interfaces/liquidos.interface";
import { LiquidosAgrupadosI } from "./interfaces/liquidos.interface";
import { EstadisticasI } from "./interfaces/estadisticas.interface";
import { BalancesI } from "./interfaces/balances.interface";

@Injectable()
export class SabanasUciService extends BaseService {
  async getSabanasUci(dto: GetSabanasUCiDto) {
    const paciente = await queries.getInfoPaciente(dto, this.context);
    if (paciente[0]) {
      const signosVitales = await queries.getSignosVitales(dto, this.context);
      const liquidos = await queries.getLiquidos(dto, this.context);
      const estadisticas = await this.getEstadisticas(dto, liquidos);
      const glucometria = await queries.getGlucometria(dto, this.context);
      const data = { paciente: paciente[0], signosVitales, liquidos, estadisticas, glucometria };
      return this.successRes(data);
    } else {
      return this.badSuccessRes("No hay reportes para este ingreso en esta fecha");
    }
  }
  private async getEstadisticas(dto: GetSabanasUCiDto, liquidos: LiquidosAgrupadosI[]) {
    const perdidaInsensible = await queries.getPerdidaInsensible(dto, this.context);
    const balances: BalancesI = await queries.getBalanceAcumulado(dto, this.context);
    let liquidosAdministrados = 0;
    let liquidosEliminados = 0;
    liquidos.map((r: LiquidosAgrupadosI) => {
      r.resultados.map((i: LiquidosAbreviadosI) => {
        if (r.liquido === "ORINA") {
          liquidosEliminados = liquidosEliminados + i.cantidad;
        } else {
          liquidosAdministrados = liquidosAdministrados + i.cantidad;
        }
      });
    });
    const estadisticas: EstadisticasI[] = [
      { key: 1, name: "Liquidos Administrados", value: liquidosAdministrados },
      { key: 2, name: "Liquidos Eliminados", value: liquidosEliminados },
      { key: 3, name: "Balance Acumulado", value: balances.BAcu },
      { key: 4, name: "Gasto Urinario", value: await queries.getGastoUrinario(dto, this.context) },
      { key: 5, name: "Perdida Insensible", value: perdidaInsensible },
      { key: 6, name: "Balance 24H", value: balances.B24H },
    ];
    return estadisticas;
  }
  async getSabanasUciMulti(dto: GetSabanasUCiMultiDto) {
    const diaEnMS = 86400000; //24 * 60 * 60 * 1000
    const inicioReporte = new Date(dto.inicioReporte);
    const finalReporte = new Date(dto.finalReporte);
    let fecha = inicioReporte;
    //Se genera array con las fechas en el rango establecido (inicioReporte - finalReporte).
    const fechas = [];
    while (fecha <= finalReporte) {
      fechas.push(fecha.toISOString().split("T")[0]);
      const siguienteDia = new Date(fecha.getTime() + diaEnMS);
      fecha = siguienteDia;
    }
    //Se genera reporte de sabanas fecha por fecha con el metodo getSabanasUci().
    const reportes = [];
    for (let i = 0; i < fechas.length; i++) {
      const newDto: GetSabanasUCiDto = { ingreso: dto.ingreso, fecha: fechas[i] };
      let result: ResponseI = await this.getSabanasUci(newDto);
      if (result.success) {
        const reporte = Object.assign({ fechaRegistro: fechas[i] }, result.data);
        reportes.push(reporte);
      }
    }
    if (reportes.length > 0) {
      return this.successRes({ reportes });
    } else {
      return this.badSuccessRes("No hay ningún reporte en este rango de fechas");
    }
  }
  async getEstanciasPaciente(dto: GetEstanciasPacienteDto) {
    const estancias: EstanciaPacienteI[] = await queries.getEstanciasPaciente(dto, this.context);
    if (estancias[0]) {
      return this.successRes({ estancias });
    } else {
      return this.badSuccessRes("No se encontraron estancias para este paciente");
    }
  }
  async getPacientesSinPeso() {
    return this.successRes(await queries.getPacientesSinPeso(this.context));
  }
}
