import * as cn from "src/application/services/connection.service";
import { GetInfoGeneralDto } from "../dtos/get-info-general.dto";
import { RadicacionDiariaI } from "../interfaces/radicacion-diaria.interface";

export const getRadicacionDiaria = async (
  dto: GetInfoGeneralDto,
  context: string
): Promise<RadicacionDiariaI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
        DAY(SFAFECFAC) DIA,
        COUNT(SLNFACTUR) TOTALFACTURADA,
        COUNT(CRNRADFACC) TOTALRADICADO,
        COUNT(CASE WHEN SLNFACTUR IS NULL THEN NULL ELSE SLNFACTUR END) -
            COUNT(CASE WHEN CRNRADFACC IS NOT NULL THEN CRNRADFACC ELSE NULL END) -
                COUNT(CASE WHEN CRNRADFACC IS NULL AND SFADOCANU = 1 THEN SFADOCANU ELSE NULL END)
                AS PENDIENTE,
        COUNT(CASE WHEN CRNRADFACC IS NULL AND SFADOCANU = 1 THEN SFADOCANU ELSE NULL END) ANULADAS
        FROM GCVRADFACTUR WHERE CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1 AND ADNCENATE IN(@2, @3)
        GROUP BY DAY(SFAFECFAC);`,
      [dto.inicioReporte, dto.finalReporte, dto.centro1, dto.centro2]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
