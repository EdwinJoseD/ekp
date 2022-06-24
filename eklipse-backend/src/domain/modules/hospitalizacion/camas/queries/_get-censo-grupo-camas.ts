import { GetCensoGrupocamasDto } from "../dtos/get-censo-grupo-camas.dto";
import * as cn from "src/application/services/connection.service";

export const getCensoGrupoCamas = async (dto: GetCensoGrupocamasDto, context: string) => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      HSUCODIGO,
      HSUNOMBRE,
      COUNT(G.HCACODIGO) CAMAS,
      COUNT(
          CASE
              HCAESTADO
              WHEN 2 THEN HCAESTADO
              ELSE NULL
          END
      ) OCUPADAS,
      COUNT(
          CASE
              HCAESTADO
              WHEN 1 THEN HCAESTADO
              ELSE NULL
          END
      ) DESOCUPADAS
  FROM
      GCVHOSCENCAM G
  WHERE
      HGRCODIGO = @0
  GROUP BY
      HSUCODIGO,
      HSUNOMBRE`,
      [dto.grupo]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
