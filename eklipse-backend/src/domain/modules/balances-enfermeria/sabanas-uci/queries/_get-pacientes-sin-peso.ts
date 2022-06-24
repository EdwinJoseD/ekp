import * as cn from "src/application/services/connection.service";
import { PacienteSinPesoI } from "../interfaces/pacientes-sin-peso.interface";

export const getPacientesSinPeso = async (context: string): Promise<PacienteSinPesoI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      T.*
  FROM
      ADNINGRESO A
      RIGHT JOIN(
          SELECT
              TOP 1 WITH TIES AINCONSEC,
              H.HCRPESO,
              --H.OID,
              --H.HCFECREG
              GPADOCPAC IDENTIFICACION,
              GPANOMPAC NOMBREPACIENTE,
              HSUCODIGO SUBGRUPOCODIGO,
              HSUNOMBRE SUBGRUPOCAMA,
              ACANOMBRE CENTROATENCION
          FROM
              GCVHOSCENPAC G
              INNER JOIN HCNREGENF H ON H.ADNINGRESO = G.ADNINGRESO
          WHERE
              (HESFECSAL IS NULL)
              AND (HCAESTADO < 3)
              AND HCACODIGO LIKE '%UCI%'
              AND H.HCFECREG = CONVERT(DATE, GETDATE(), 103)
          GROUP BY
              AINCONSEC,
              HSUCODIGO,
              HSUNOMBRE,
              GPANOMPAC,
              GPADOCPAC,
              ACANOMBRE,
              H.HCFECREG,
              H.HCRPESO,
              H.HCFECREG,
              H.OID
          ORDER BY
              ROW_NUMBER() OVER(
                  PARTITION BY G.AINCONSEC
                  ORDER BY
                      H.OID
              )
      ) T ON T.AINCONSEC = A.AINCONSEC
  WHERE
      T.HCRPESO = 0`
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
