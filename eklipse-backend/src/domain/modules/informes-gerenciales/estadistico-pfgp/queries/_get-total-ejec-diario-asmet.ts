import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { GetTotalEjecDiarioDto } from "../dtos/get-total-ejec-diario.dto";
import { EjecutadoDiarioI } from "../interfaces/ejecutado-diario.interface";

export const GetTotalEjecutadoDiarioAsmet = async (
  dto: GetTotalEjecDiarioDto,
  context: string
): Promise<EjecutadoDiarioI[]> => {
  let query: string;
  let parameters: any[] = [];
  if (context === ContextsE.ALTACENTRO) {
    query = `SELECT 
    ISNULL(CONS.NContrato, 'ASMET') NContrato,
    ISNULL(CONS.Contrato, 'PGP ASMET SALUD SUBS - CONTR' )Contrato,
    G.DayNumberOfMonth Dia,
    ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
    FROM 
    GCMDIMFECHA G LEFT JOIN(
     Select
      'ASMET' As NContrato,
      'PGP ASMET SALUD SUBS - CONTR ' As Contrato,
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
      AND GENDETCON.GDECODIGO BETWEEN '8005' AND '8006'
    GROUP BY day(SLNFACTUR.SFAFECFAC)
    ) AS CONS ON CONS.Dia = G.DayNumberOfMonth
    WHERE CONVERT(DATE, G.Date, 103) Between @0 And @1;`;
    parameters = [dto.inicioReporte, dto.finalReporte, dto.contrato];
  } else if (context === ContextsE.AGUACHICA) {
    query = `SELECT 
    ISNULL(CONS.NContrato, '8003 - 8004') NContrato,
    ISNULL(CONS.Contrato, 'PGP ASMET SALUD EPS - SUBS - CONTR')Contrato,
    G.DayNumberOfMonth Dia,
    ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
    FROM 
    GCMDIMFECHA G LEFT JOIN(
     Select
      '8003 - 8004' As NContrato,
      'PGP ASMET SALUD EPS - SUBS - CONTR' As Contrato,
      (G.LIMITE/30) VMedio,
      DAY(SLNFACTUR.SFAFECFAC) Dia,
      SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado
    From SLNFACTUR SLNFACTUR
      Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
      Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
      LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
      LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
      LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = '8004'
    Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
      AND  SLNFACTUR.SFADOCANU = N'0'
      and SLNFACTUR.SFATIPDOC = 17
      AND GENDETCON.GDECODIGO IN('8003', '8004')
    GROUP BY day(SLNFACTUR.SFAFECFAC), G.LIMITE
    )AS CONS ON CONS.Dia = G.DayNumberOfMonth
    WHERE CONVERT(DATE, G.Date, 103) Between @0 And @1;`;
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
