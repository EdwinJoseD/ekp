import { Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import * as queries from "./queries";
import { DietaJornadaRepository } from "./repositories/dieta-jornada.repository";
import { CreateJornadaDietaDto } from "./dtos/create-jornada-dieta.dto";
import { GetPacPorAsignarDietaDto } from "./dtos/get-pac-asig-die.dto";
import { GetDietaJornadaDto } from "./dtos/get-dieta-jornada.dto";
import { GetDietaEstadoDto } from "./dtos/get-dieta-estado.dto";
@Injectable()
export class DietasService extends BaseService {
  async getJornadasDieta(dto: GetDietaJornadaDto) {
    const jornadasDieta = await DietaJornadaRepository(this.context).getDietaJornada(dto);
    if (jornadasDieta[0]) {
      return this.successRes({ jornadasDieta });
    } else {
      return this.badSuccessRes("No se encontraron dietas en la jornada definida actualmente");
    }
  }
  async getEstadoDieta(dto: GetDietaEstadoDto) {
    const dietas = await queries.getDietaEstado(dto, this.context);
    const consistencias = await queries.getConsistencia(dto, this.context);
    const combinaciones = await queries.getCombinaciones(dto, this.context);
    const data = { dietas, consistencias, combinaciones };
    if (!data) {
      return this.badSuccessRes("No hay Dietas Para Mostrar");
    } else {
      return this.successRes(data);
    }
  }
  async getPacPorAsignarDieta(dto: GetPacPorAsignarDietaDto) {
    const pacientes = await queries.getPacientesPorAsignarDieta(dto, this.context);
    const badSucMsg = "El subgrupo de camas no tiene pacientes hospitalizados en el centro de atención";
    if (pacientes[0]) {
      return this.successRes({ pacientes });
    } else {
      return this.badSuccessRes(badSucMsg);
    }
  }
  async createJornadaDieta(body: CreateJornadaDietaDto) {
    const sucMsg = "El subgrupo de hospitalización fue registrado en la jornada de dieta exitosamente";
    const badSucMsg = "Este Subgrupo de Hospitalizacion ya se encuentra registrado en esta jornada";
    const badHorHabMsg = "Está intentando registrar dietas fuera del rango de horas habiles";
    if (this.jornadaValida(body.jornadaDieta)) {
      const result = await queries.createJornadaDieta(body, this.authUserId, this.context);
      if (result) {
        return this.successRes([], sucMsg);
      } else {
        return this.badSuccessRes(badSucMsg);
      }
    } else {
      return this.badSuccessRes(badHorHabMsg);
    }
  }
  private jornadaValida(jornadaDieta: number): boolean {
    const time = new Date().getHours() * 60 + new Date().getMinutes();
    switch (jornadaDieta) {
      case (jornadaDieta = 1):
        return time > 0 && time < 301;
      case (jornadaDieta = 2):
        return time > 570 && time < 630;
      case (jornadaDieta = 3):
        return time > 800 && time < 945;
      default:
        return false;
    }
  }
}
