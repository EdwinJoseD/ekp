import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { GetConsumidoFacturadoDto } from "../dtos/get-consumido-facturado.dto";
import { ConsumidoI } from "../interfaces/consumido.interface";

export const getConsumidoFacturado = async (
  dto: GetConsumidoFacturadoDto,
  context: string
): Promise<ConsumidoI[]> => {
  let query: string;
  let parameters: any[];
  const common = `Select
  GENDETCON.GDECODIGO As NContrato,
  GENDETCON.GDENOMBRE As Contrato,
  SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
  SUM(SLNFACTUR.SFAVALREC) ValorAnticipo,
  ISNULL(G.LIMITE, 0) TotalFacturado,
  COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
  ISNULL((G.LIMITE - SUM(SLNFACTUR.SFAVALCAR)), 0) ErrorAbsoluto,
  ISNULL(((G.LIMITE - SUM(SLNFACTUR.SFAVALCAR)) / G.LIMITE)*100, 0) ErrorRelativo,
  ISNULL(ROUND(((SUM(SLNFACTUR.SFAVALCAR) / G.LIMITE)*100), 2),0) Porcentaje
  From SLNFACTUR SLNFACTUR
  Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
  Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
  LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
  LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
  LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO`;
  if (context === ContextsE.VALLEDUPAR) {
    query = `${common} Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 AND @1
        AND  SLNFACTUR.SFADOCANU = N'0'
        and SLNFACTUR.SFATIPDOC = 17
        AND GENDETCON.GDECODIGO = 'I202'
      GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE;`;
    parameters = [dto.inicioReporte, dto.finalReporte];
  } else if (context === ContextsE.ALTACENTRO) {
    query = `${common} Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
    AND  SLNFACTUR.SFADOCANU = N'0'
    and SLNFACTUR.SFATIPDOC = 17
    AND GENDETCON.GDECODIGO IN('8001', '8009', '8010')
    AND ADNINGRESO.ADNCENATE BETWEEN @2 AND @3
  GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
  --ORDER BY GENDETCON.GDECODIGO;
  UNION
   Select
    '8005 - 8006' As NContrato,
    'PGP ASMET SALUD SUBS - CONTR' As Contrato,
    SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
    SUM(SLNFACTUR.SFAVALREC) ValorAnticipo,
    ISNULL(G.LIMITE, 0) TotalFacturado,
    COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
    ISNULL((G.LIMITE - SUM(SLNFACTUR.SFAVALCAR)), 0) ErrorAbsoluto,
    ISNULL(((G.LIMITE - SUM(SLNFACTUR.SFAVALCAR)) / G.LIMITE)*100, 0) ErrorRelativo,
    ISNULL(ROUND(((SUM(SLNFACTUR.SFAVALCAR) / G.LIMITE)*100), 2),0) Porcentaje
  From SLNFACTUR SLNFACTUR
    Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
    Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
    LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
    LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
    LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = '8006'
  Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
    AND  SLNFACTUR.SFADOCANU = N'0'
    and SLNFACTUR.SFATIPDOC = 17
    AND GENDETCON.GDECODIGO IN('8005', '8006')
    AND ADNINGRESO.ADNCENATE BETWEEN @2 AND @3
  GROUP BY G.LIMITE;`;
    parameters = [dto.inicioReporte, dto.finalReporte, dto.centro1, dto.centro2];
  } else if (context === ContextsE.AGUACHICA) {
    query = `${common} Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
    AND  SLNFACTUR.SFADOCANU = N'0'
    and SLNFACTUR.SFATIPDOC = 17
    AND GENDETCON.GDECODIGO IN ('8000', '8001', '8002', '8005')
  GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
  UNION
   Select
    '8003 - 8004' As NContrato,
    'PGP ASMET SALUD SUBS - CONTR' As Contrato,
    SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
    SUM(SLNFACTUR.SFAVALREC) ValorAnticipo,
    ISNULL(G.LIMITE, 0) TotalFacturado,
    COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
    ISNULL((G.LIMITE - SUM(SLNFACTUR.SFAVALCAR)), 0) ErrorAbsoluto,
    ISNULL(((G.LIMITE - SUM(SLNFACTUR.SFAVALCAR)) / G.LIMITE)*100, 0) ErrorRelativo,
    ISNULL(ROUND(((SUM(SLNFACTUR.SFAVALCAR) / G.LIMITE)*100), 2),0) Porcentaje
  From SLNFACTUR SLNFACTUR
    Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
    Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
    LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
    LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
    LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = '8004'
  Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
    AND  SLNFACTUR.SFADOCANU = N'0'
    and SLNFACTUR.SFATIPDOC = 17
    AND GENDETCON.GDECODIGO IN('8003',  '8004')
  GROUP BY G.LIMITE;`;
    parameters = [dto.inicioReporte, dto.finalReporte];
  } else {
    cn.ThrBadReqExc("El context no es valido");
  }
  try {
    const result = await cn.getDataSource(context).query(query, parameters);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
