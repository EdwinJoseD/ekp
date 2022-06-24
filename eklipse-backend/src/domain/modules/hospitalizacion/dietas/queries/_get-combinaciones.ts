import * as cn from "src/application/services/connection.service";
import { CombinacionI } from "../interfaces/combinacion.interface";
import { GetDietaEstadoDto } from "../dtos/get-dieta-estado.dto";

export const getCombinaciones = async (
  dto: GetDietaEstadoDto,
  context: string
): Promise<CombinacionI> => {
  try {
    const result = await cn
      .getDataSource(context)
      .query(`EXEC ObtenerCombinacionesDeDieta @0;`, [dto.jornadaDieta]);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
