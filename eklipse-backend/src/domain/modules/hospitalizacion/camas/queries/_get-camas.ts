import * as cn from "src/application/services/connection.service";
import { CamasI } from "../interfaces/camas.interface";

export const getCamas = async (context: string): Promise<CamasI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      HCAESTADO,
      HSUCODIGO,
      HCACODIGO,
      GPADOCPAC,
      GPANOMPAC,
      AINCONSEC,
      GDENOMBRE,
      ACANOMBRE
  FROM
      GCVHOSCENCAM
  ORDER BY
      GPADOCPAC DESC`
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
