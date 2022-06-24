import * as cn from "src/application/services/connection.service";
import { SumPacEnJornI } from "../interfaces/sum-jorn.interface";
import { GetDietaJornadaDto } from "../dtos/get-dieta-jornada.dto";

export const getPacientesEnJornada = async (
  dto: GetDietaJornadaDto,
  context: string
): Promise<SumPacEnJornI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `select
      GCMDIEJOR,
      COUNT(*) AS PACIENTES
  from
      GCMHOSDIEEST
  where
      DIEFECJOR = @0
  group by
      GCMDIEJOR`,
      [dto.fecha]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
