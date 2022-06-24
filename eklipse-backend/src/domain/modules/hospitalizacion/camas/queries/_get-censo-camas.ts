import * as cn from "src/application/services/connection.service";

export const getCensoCamas = async (context: string) => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      G.HGRCODIGO,
      G.HGRNOMBRE,
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
  GROUP BY
      G.HGRCODIGO,
      G.HGRNOMBRE
  ORDER BY
      G.HGRCODIGO`
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
