import * as cn from "src/application/services/connection.service";
import { EpicrisisI } from "../interfaces/epicrisis.interface";
import { EpicrisisDto } from "../dtos/epicrisis.dto";

export const getEpicrisis = async (dto: EpicrisisDto, context: string): Promise<EpicrisisI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      A.AINCONSEC,
      E.HCECONSEC NUMEROEPICRISIS,
      E.HCEFECDOC FECHAREGISTRO,
      P.PACNUMDOC IDENTIFICACION,
      P.PACEXPEDI EXPEDICION,
      P.GPANOMCOM NOMBREPACIENTE,
      M.GMENOMCOM NOMBREMEDICO,
      (
          CASE
              WHEN E.HCEESTDOC = 0 THEN 'REGISTRADA'
              WHEN E.HCEESTDOC = 1 THEN 'CONFIRMADA'
          END
      ) ESTADO
  FROM
      HCNEPICRI E
      INNER JOIN ADNINGRESO A ON E.ADNINGRESO = A.OID
      INNER JOIN GENPACIEN P ON E.GENPACIEN = P.OID
      INNER JOIN GENMEDICO M ON E.GENMEDICO = M.OID
  WHERE
      E.HCECONSEC = @0
      AND E.HCEESTDOC = 1`,
      [dto.consecutivo]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
