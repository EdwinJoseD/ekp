import { ContextsE as ctxts } from "src/application/enums/contexts.enum";
import * as cn from "src/application/services/connection.service";
import { GetInfoGeneralDto } from "../dtos/get-info-general.dto";
import { RadicacionAcumuladaI } from "../interfaces/radicacion-acumulada.interface";

export const getRadicacionAcumulada = async (
  dto: GetInfoGeneralDto,
  context: string
): Promise<RadicacionAcumuladaI[]> => {
  let query: string;
  if (context === ctxts.VALLEDUPAR) {
    query = `SELECT
        DAY(A.SFAFECFAC) DIA,
    (SELECT SUM(CRDVALRAD) FROM GCVRADFACTUR B  
     WHERE CONVERT(DATE, B.SFAFECFAC, 103) BETWEEN @0 and @1
    AND DAY(B.SFAFECFAC) = DAY(A.SFAFECFAC)
    )AS ACUMULADORADICADO,
    (
    (SELECT SUM(CRDVALRAD) FROM GCVRADFACTUR B  
     WHERE CONVERT(DATE, B.SFAFECFAC, 103) BETWEEN @0 and @1
    AND DAY(B.SFAFECFAC) = DAY(A.SFAFECFAC)
    )
    -
    (SELECT SUM(SFATOTFAC) FROM GCVRADFACTUR B  
     WHERE CONVERT(DATE, B.SFAFECFAC, 103) BETWEEN @0 and @1
    AND DAY(B.SFAFECFAC) = DAY(A.SFAFECFAC)
    AND CRNRADFACC IS NULL AND SFADOCANU = 1
    )
    )AS FACT,
    (SELECT SUM(SFATOTFAC) FROM GCVRADFACTUR B  
     WHERE CONVERT(DATE, B.SFAFECFAC, 103) BETWEEN @0 and @1
    AND DAY(B.SFAFECFAC) = DAY(A.SFAFECFAC)
    AND CRNRADFACC IS NULL AND SFADOCANU = 1
    )AS ACUMULADORADICADOS
        FROM GCVRADFACTUR A
        WHERE CONVERT(DATE, A.SFAFECFAC, 103) BETWEEN @0 and @1 --AND ADNCENATE IN(@2, @3)
        GROUP BY 
    DAY(A.SFAFECFAC);`;
  } else {
    query = `SELECT
    DAY(SFAFECFAC) DIA,
    SUM(SUM(CRDVALRAD)) OVER (ORDER BY DAY(SFAFECFAC)) AS ACUMULADORADICADO,
    SUM(SUM(SFATOTFAC)) OVER (ORDER BY DAY(SFAFECFAC))-CONS.ACUMULADORADICADOS FACT,
    CONS.ACUMULADORADICADOS
    FROM GCVRADFACTUR LEFT JOIN(
    SELECT 
    DAY(SFAFECFAC) DIAS,
    SUM(SUM(SFATOTFAC)) OVER (ORDER BY DAY(SFAFECFAC)) AS ACUMULADORADICADOS
    FROM GCVRADFACTUR WHERE CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1 
    AND CRNRADFACC IS NULL AND SFADOCANU = 1 GROUP BY DAY(SFAFECFAC)) AS CONS ON CONS.DIAS = DAY(SFAFECFAC)
    WHERE CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1 AND ADNCENATE IN(@2, @3)
    AND ISNULL(CRFESTADO, 4) IN(-1, 0, 1, 2, 4)
    GROUP BY CONS.ACUMULADORADICADOS, DAY(SFAFECFAC);`;
  }
  try {
    const result = await cn
      .getDataSource(context)
      .query(query, [dto.inicioReporte, dto.finalReporte, dto.centro1, dto.centro2]);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
