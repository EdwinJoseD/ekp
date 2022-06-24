import * as cn from "src/application/services/connection.service";
import { GetDietaJornadaDto } from "../dtos/get-dieta-jornada.dto";
import { SumTotalJornI } from "../interfaces/sum-jorn.interface";

export const getCostoJornada = async (
  dto: GetDietaJornadaDto,
  context: string
): Promise<SumTotalJornI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      G.GCMDIEJOR,
      SUM(
          (
              CASE
                  G.DIEGRUCON
                  WHEN 'LIQUIDA' THEN 3700
                  WHEN 'LICUADOS SIN GRUMOS' THEN 3700
                  ELSE P.PRECIO
              END
          )
      ) AS TOTALJORNADA
  FROM
      GCMHOSDIEEST G
      INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
      INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
  WHERE
      G.DIEFECJOR = @0
  GROUP BY
      G.GCMDIEJOR;`,
      [dto.fecha]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
