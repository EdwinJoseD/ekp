import * as cn from "src/application/services/connection.service";
import * as queries from "../queries/index";
import { DietaJornadaEntity } from "src/domain/entities/hospitalizacion/dieta-jornada.entity";
import { GetDietaJornadaDto } from "../dtos/get-dieta-jornada.dto";
import { SumPacEnJornI, SumTotalJornI } from "../interfaces/sum-jorn.interface";
import { JornadaDietaI } from "../interfaces/jornada-dieta.interface";
import { TipoDietasE } from "../enums/tipo-dietas.enum";

export const DietaJornadaRepository = (context: string) =>
  cn
    .getDataSource(context)
    .getRepository(DietaJornadaEntity)
    .extend({
      async getDietaJornada(dto: GetDietaJornadaDto): Promise<JornadaDietaI[]> {
        try {
          //Obteniendo las jornadas registradas en la fecha seleccionada
          const jornadas = await cn
            .getDataSource(context)
            .getRepository(DietaJornadaEntity)
            .createQueryBuilder("dietajornada")
            .where("dietajornada.FECHADIETA = :fecha", {
              fecha: dto.fecha,
            })
            .getMany();
          //Obteniendo suma de pacientes registrados en cada jornada
          const pacsEnJornada = await queries.getPacientesEnJornada(dto, context);
          //Obteniendo suma de pacientes registrados en cada jornada
          const costoJornadas = await queries.getCostoJornada(dto, context);
          //Agregando conteo de pacientes y valor a la jornada
          const newArr: JornadaDietaI[] = [];
          jornadas.map((r: DietaJornadaEntity) => {
            const pacEnJorn = pacsEnJornada.filter((i: SumPacEnJornI) => i.GCMDIEJOR === r.ID);
            const TotalJorn = costoJornadas.filter((i: SumTotalJornI) => i.GCMDIEJOR === r.ID);
            const newDieJorn: JornadaDietaI = {
              ID: r.ID,
              DIETACENTRO: r.DIETACENTRO,
              CENTROATENCION: getCentroAtencion(r.CENTROATENCION),
              FECHADIETA: r.FECHADIETA.toISOString(),
              JORNADADIETA: getJornada(r.JORNADADIETA),
              DIETAESTADO: r.DIETAESTADO,
              USERREGDIETA: r.USERREGDIETA,
              FECHAREGDIETA: r.FECHAREGDIETA.toISOString(),
              PACIENTES: pacEnJorn[0] ? pacEnJorn[0].PACIENTES : 0,
              VALOR: TotalJorn[0] ? TotalJorn[0].TOTALJORNADA : 0,
            };
            newArr.push(newDieJorn);
          });
          return newArr;
        } catch (error) {
          cn.ThrBadReqExc();
        }
      },
    });
/** Retorna el centro de atención dependiendo del id recibido. */
export const getCentroAtencion = (ADNCENATE: number) => {
  switch (ADNCENATE) {
    case 1:
      return "MEDICO CENTRO";
    case 2:
      return "ALTA COMPLEJIDAD DEL CARIBE";
    default:
      return "";
  }
};
/** Retorna el tipo de jornada dependiendo del id recibido. */
export const getJornada = (jornada: number) => {
  switch (jornada) {
    case TipoDietasE.DESAYUNO:
      return "DESAYUNO";
    case TipoDietasE.ALMUERZO:
      return "ALMUERZO";
    case TipoDietasE.CENA:
      return "CENA";
    default:
      return "INDEFINIDO";
  }
};
