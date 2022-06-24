import * as cn from "src/application/services/connection.service";
import { ConsistenciaI } from "../interfaces/consistencia.interface";
import { GetDietaEstadoDto } from "../dtos/get-dieta-estado.dto";

export const getConsistencia = async (
  dto: GetDietaEstadoDto,
  context: string
): Promise<ConsistenciaI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      G.GCMDIEJOR JORNADA,
      G.DIEGRUCON CONSISTENCIA,
      COUNT(*) CANTIDAD,
      SUM(
          (
              CASE
                  G.DIEGRUCON
                  WHEN 'LIQUIDA' THEN 3700
                  WHEN 'LICUADOS SIN GRUMOS' THEN 3700
                  ELSE P.PRECIO
              END
          )
      ) VALOR
  FROM
      GCMHOSDIEEST G
      INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
  WHERE
      GCMDIEJOR = @0
  GROUP BY
      GCMDIEJOR,
      DIEGRUCON;`,
      [dto.jornadaDieta]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
