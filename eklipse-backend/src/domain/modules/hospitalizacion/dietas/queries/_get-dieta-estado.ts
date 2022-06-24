import * as cn from "src/application/services/connection.service";
import { DietaI } from "../interfaces/dieta.interface";
import { GetDietaEstadoDto } from "../dtos/get-dieta-estado.dto";

export const getDietaEstado = async (dto: GetDietaEstadoDto, context: string): Promise<DietaI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      G.GCMDIEJOR ID,
      G.HPNESTANC,
      H.HSUNOMBRE SUBGRUPO,
      H.HCACODIGO CODIGOCAMA,
      H.GPANOMPAC PACIENTE,
      (
          CASE
              G.DIEJORNAD
              WHEN 1 THEN 'DESAYUNO'
              WHEN 2 THEN 'ALMUERZO'
              WHEN 3 THEN 'CENA'
              ELSE ''
          END
      ) AS DIETAJORNADA,
      G.DIEGRUTIP TIPO,
      G.DIEGRUCON CONSISTENCIA,
      (
          CASE
              G.DIEGRUCON
              WHEN 'LIQUIDA' THEN (
                  SELECT
                      PRECIO
                  FROM
                      GCMPRECOM
                  WHERE
                      OID = 4
              )
              WHEN 'LICUADOS SIN GRUMOS' THEN (
                  SELECT
                      PRECIO
                  FROM
                      GCMPRECOM
                  WHERE
                      OID = 4
              )
              ELSE P.PRECIO
          END
      ) AS VALOR,
      G.DIEFECJOR FECHA,
      G.DIEESTADO ESTADO
  FROM
      GCMHOSDIEEST G
      INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
      INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
  WHERE
      G.GCMDIEJOR = @0;`,
      [dto.jornadaDieta]
    );
    /*
    const total = await cn.query(
      context,
      `SELECT
      SUM((CASE G.DIEGRUCON
      WHEN 'LIQUIDA' THEN 3700
      WHEN 'LICUADOS SIN GRUMOS' THEN 3700
      ELSE P.PRECIO
      END)) AS VALOR
      FROM GCMHOSDIEEST G
      INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
      INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
      WHERE G.GCMDIEJOR = @0 GROUP BY G.GCMDIEJOR;`,
      [dto.jornadaDieta]
    );*/
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
