import * as cn from "src/application/services/connection.service";
import { GetInfoGeneralDto } from "../dtos/get-info-general.dto";
import { RadPorDocumentosI } from "../interfaces/rad-por-documentos.interface";

export const getRadPorDocumentos = async (
  dto: GetInfoGeneralDto,
  context: string
): Promise<RadPorDocumentosI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
    CASE WHEN SFATIPDOC = 0 THEN 'FACTURA PACIENTE'
         WHEN SFATIPDOC = 1 THEN 'FACTURA ENTIDAD' 
         WHEN SFATIPDOC = 16 THEN 'FACTURA GLOBAL PGP' ELSE NULL END AS SFATIPDOC,
    COUNT(SLNFACTUR) CANT,
    COUNT(CRNRADFACC) RAD,
    COUNT(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN SFADOCANU ELSE NULL END) ANU,
    SUM(SFATOTFAC) FACTURADO,
    ISNULL(SUM(SFATOTFAC)-SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN SFATOTFAC ELSE NULL END), SUM(SFATOTFAC)) RADICABLE,
    SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN NULL ELSE CRDVALRAD END) RADICADO,
    (SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN NULL ELSE CRDVALRAD END)
    /ISNULL(SUM(SFATOTFAC)-SUM(CASE WHEN SFADOCANU = 1 AND CRNRADFACC IS NULL THEN SFATOTFAC ELSE NULL END), SUM(SFATOTFAC)))*100 PORC
    FROM GCVRADFACTUR WHERE CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1 
    AND ISNULL(CRFESTADO, 4) IN(-1, 0, 1, 2, 4)
    GROUP BY SFATIPDOC;`,
      [dto.inicioReporte, dto.finalReporte]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
