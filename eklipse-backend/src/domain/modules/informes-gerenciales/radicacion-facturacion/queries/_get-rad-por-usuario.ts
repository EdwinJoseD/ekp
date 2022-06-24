import * as cn from "src/application/services/connection.service";
import { GetInfoGeneralDto } from "../dtos/get-info-general.dto";
import { RadPorEstadoI } from "../interfaces/rad-por-estado.interface";

export const getRadPorUsuario = async (
  dto: GetInfoGeneralDto,
  context: string
): Promise<RadPorEstadoI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
    USUDESCON, COUNT(SLNFACTUR) CANT, COUNT(CRNRADFACC) RAD,
    COUNT(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN SFADOCANU ELSE NULL END) ANU,
    SUM(SFATOTFAC) FACTURADO,
    ISNULL(SUM(SFATOTFAC)-SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN SFATOTFAC ELSE NULL END), SUM(SFATOTFAC)) RADICABLE,
    SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN NULL ELSE CRDVALRAD END) RADICADO,
    (SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN NULL ELSE CRDVALRAD END)
    /ISNULL(SUM(SFATOTFAC)-SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN SFATOTFAC ELSE NULL END), SUM(SFATOTFAC)))*100 PORC
    FROM GCVRADFACTUR WHERE CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
    AND ISNULL(CRFESTADO, 4) IN(-1, 0, 1, 2, 4)
    GROUP BY USUDESCON;`,
      [dto.inicioReporte, dto.finalReporte]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
