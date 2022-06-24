import * as cn from "src/application/services/connection.service";
import { SubgrupoCamaI } from "src/domain/modules/hospitalizacion/camas/interfaces/subgrupo.cama.interface";
import { GetSubgruposCamasDto } from "../dtos/get-subgs-camas.dto";

export const getSubgruposCamas = async (
  dto: GetSubgruposCamasDto,
  context: string
): Promise<SubgrupoCamaI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      DISTINCT (A.OID) ID,
      A.HSUCODIGO,
      A.HSUNOMBRE,
      B.ADNCENATE CENTROATENCION
  FROM
      HPNSUBGRU A
      INNER JOIN HPNDEFCAM B ON A.OID = B.HPNSUBGRU
  WHERE
      B.ADNCENATE = @0`,
      [dto.centroAtencion]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
