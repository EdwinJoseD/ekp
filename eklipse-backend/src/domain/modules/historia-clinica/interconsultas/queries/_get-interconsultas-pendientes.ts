import * as cn from "src/application/services/connection.service";
import { InterconsultaI } from "src/domain/modules/historia-clinica/interconsultas/interfaces/interconsulta.interface";

export const getInterconsultasPendientes = async (context: string): Promise<InterconsultaI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      *
  FROM
      GCVHCNINTERC
  WHERE
      HCNINTERR IS NULL
      AND AINESTADO = 0
      AND HCIREGSUS = 0 --GROUP BY GENESPECI, GEEDESCRI`
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
