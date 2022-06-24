import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { GetTotalEjecDiarioDto } from "../dtos/get-total-ejec-diario.dto";
import { EjecutadoDiarioI } from "../interfaces/ejecutado-diario.interface";

export const GetTotalEjecutadoDiario = async (
  dto: GetTotalEjecDiarioDto,
  context: string
): Promise<EjecutadoDiarioI[]> => {
  let query: string;
  let parameters: any[] = [dto.inicioReporte, dto.finalReporte, dto.contrato];
  if (context === ContextsE.VALLEDUPAR) {
    query = `SELECT 
    ISNULL(CONS.NContrato, 'I202') NContrato,
    ISNULL(CONS.Contrato, 'PGP NUEVA EPS S.A.S')Contrato,
    G.DayNumberOfMonth Dia,
    ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
    FROM 
    GCMDIMFECHA G LEFT JOIN(
     Select
      GENDETCON.GDECODIGO As NContrato,
      GENDETCON.GDENOMBRE As Contrato,
      (G.LIMITE/30) VMedio,
      DAY(SLNFACTUR.SFAFECFAC) Dia,
      SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado
    From SLNFACTUR SLNFACTUR
      Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
      Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
      LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
      LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
      LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
    Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @0 AND @1
      AND  SLNFACTUR.SFADOCANU = N'0'
      and SLNFACTUR.SFATIPDOC = 17
      AND GENDETCON.GDECODIGO = @2
    GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, day(SLNFACTUR.SFAFECFAC), G.LIMITE
    )AS CONS ON CONS.Dia = G.DayNumberOfMonth
    WHERE CONVERT(DATE, G.Date, 103) BETWEEN @0 AND @1;`;
  } else if (context === ContextsE.ALTACENTRO) {
    query = `SELECT 
    ISNULL(CONS.NContrato, '8001') NContrato,
    ISNULL(CONS.Contrato, 'PGP NUEVA EPS- CONTRIBUTIVO')Contrato,
    G.DayNumberOfMonth Dia,
    ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
    FROM 
    GCMDIMFECHA G LEFT JOIN(
     Select
      GENDETCON.GDECODIGO As NContrato,
      GENDETCON.GDENOMBRE As Contrato,
      (G.LIMITE/30) VMedio,
      DAY(SLNFACTUR.SFAFECFAC) Dia,
      SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado
    From SLNFACTUR SLNFACTUR
      Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
      Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
      LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
      LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
      LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
    Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
      AND  SLNFACTUR.SFADOCANU = N'0'
      and SLNFACTUR.SFATIPDOC = 17
      AND GENDETCON.GDECODIGO = @2
    GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, day(SLNFACTUR.SFAFECFAC), G.LIMITE
    )AS CONS ON CONS.Dia = G.DayNumberOfMonth
    WHERE CONVERT(DATE, G.Date, 103) Between @0 And @1;`;
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
