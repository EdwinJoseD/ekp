import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { EjecutadoDiarioI } from "../interfaces/ejecutado-diario.interface";

export const GetTotalEjecutadoDiarioAcostadoNueva = async (
  context: string
): Promise<EjecutadoDiarioI> => {
  let query: string;
  if (context === ContextsE.VALLEDUPAR) {
    query = `SELECT 
          ISNULL(CONS.NContrato, 'I202') NContrato,
          ISNULL(CONS.Contrato, 'PGP NUEVA EPS S.A.S')Contrato,
          G.DayNumberOfMonth Dia,
          ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
          FROM 
          GCMDIMFECHA G LEFT JOIN(SELECT   
          GENDETCON.GDECODIGO As NContrato,
          GENDETCON.GDENOMBRE As Contrato,
          DAY(SLNORDSER.SOSFECORD) Dia,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO = 'I202'
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND MONTH(SLNORDSER.SOSFECORD) = MONTH(GETDATE()) AND YEAR(SLNORDSER.SOSFECORD) = YEAR(GETDATE())
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, DAY(SLNORDSER.SOSFECORD)
        )AS CONS ON CONS.Dia = G.DayNumberOfMonth
          WHERE MONTH(G.DATE) = MONTH(GETDATE()) AND YEAR(G.DATE) = YEAR(GETDATE());`;
  } else if (context === ContextsE.ALTACENTRO) {
    query = `SELECT 
          ISNULL(CONS.NContrato, '8001') NContrato,
          ISNULL(CONS.Contrato, 'PGP NUEVA EPS- CONTRIBUTIVO')Contrato,
          G.DayNumberOfMonth Dia,
          ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
          FROM 
          GCMDIMFECHA G LEFT JOIN(SELECT   
          GENDETCON.GDECODIGO As NContrato,
          GENDETCON.GDENOMBRE As Contrato,
          DAY(SLNORDSER.SOSFECORD) Dia,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO = '8001'
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND MONTH(SLNORDSER.SOSFECORD) = MONTH(GETDATE()) AND YEAR(SLNORDSER.SOSFECORD) = YEAR(GETDATE())
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, DAY(SLNORDSER.SOSFECORD)
        )AS CONS ON CONS.Dia = G.DayNumberOfMonth
          WHERE MONTH(G.DATE) = MONTH(GETDATE()) AND YEAR(G.DATE) = YEAR(GETDATE());`;
  } else {
    cn.ThrBadReqExc("El context no es valido");
  }
  try {
    const result = await cn.getDataSource(context).query(query);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};

export const GetTotalEjecutadoDiarioAcostado8006 = async (
  context: string
): Promise<EjecutadoDiarioI> => {
  let query: string;
  if (context === ContextsE.ALTACENTRO) {
    query = `SELECT 
          ISNULL(CONS.NContrato, 'ASMET') NContrato,
          ISNULL(CONS.Contrato, 'PGP ASMET SALUD SUBS - CONTR')Contrato,
          G.DayNumberOfMonth Dia,
          ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
          FROM 
          GCMDIMFECHA G LEFT JOIN(SELECT   
          'ASMET' As NContrato,
          'PGP ASMET SALUD SUBS - CONTR' As Contrato,
          DAY(SLNORDSER.SOSFECORD) Dia,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO IN('8005', '8006')
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND MONTH(SLNORDSER.SOSFECORD) = MONTH(GETDATE()) AND YEAR(SLNORDSER.SOSFECORD) = YEAR(GETDATE())
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, DAY(SLNORDSER.SOSFECORD)
        )AS CONS ON CONS.Dia = G.DayNumberOfMonth
          WHERE MONTH(G.DATE) = MONTH(GETDATE()) AND YEAR(G.DATE) = YEAR(GETDATE());`;
  } else if (context === ContextsE.AGUACHICA) {
    query = `SELECT 
          ISNULL(CONS.NContrato, '8003 - 8004') NContrato,
          ISNULL(CONS.Contrato, 'PGP ASMET SALUD SUBS - CONTR')Contrato,
          G.DayNumberOfMonth Dia,
          ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
          FROM 
          GCMDIMFECHA G LEFT JOIN(SELECT   
          'ASMET' As NContrato,
          'PGP ASMET SALUD SUBS - CONTR' As Contrato,
          DAY(SLNORDSER.SOSFECORD) Dia,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO IN('8003', '8004')
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND MONTH(SLNORDSER.SOSFECORD) = MONTH(GETDATE()) AND YEAR(SLNORDSER.SOSFECORD) = YEAR(GETDATE())
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, DAY(SLNORDSER.SOSFECORD)
        )AS CONS ON CONS.Dia = G.DayNumberOfMonth
          WHERE MONTH(G.DATE) = MONTH(GETDATE()) AND YEAR(G.DATE) = YEAR(GETDATE());`;
  } else {
    cn.ThrBadReqExc("El context no es valido");
  }
  try {
    const result = await cn.getDataSource(context).query(query);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};

export const GetTotalEjecutadoDiarioAcostado8010 = async (
  context: string
): Promise<EjecutadoDiarioI> => {
  let query: string;
  if (context === ContextsE.ALTACENTRO) {
    query = `SELECT 
          ISNULL(CONS.NContrato, '8010') NContrato,
          ISNULL(CONS.Contrato, 'CONTINGENTE PGP ASMET SALUD')Contrato,
          G.DayNumberOfMonth Dia,
          ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
          FROM 
          GCMDIMFECHA G LEFT JOIN(SELECT   
          GENDETCON.GDECODIGO As NContrato,
          GENDETCON.GDENOMBRE As Contrato,
          DAY(SLNORDSER.SOSFECORD) Dia,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO = '8010'
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND MONTH(SLNORDSER.SOSFECORD) = MONTH(GETDATE()) AND YEAR(SLNORDSER.SOSFECORD) = YEAR(GETDATE())
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, DAY(SLNORDSER.SOSFECORD)
        )AS CONS ON CONS.Dia = G.DayNumberOfMonth
          WHERE MONTH(G.DATE) = MONTH(GETDATE()) AND YEAR(G.DATE) = YEAR(GETDATE());`;
  } else if (context === ContextsE.AGUACHICA) {
    query = `SELECT 
          ISNULL(CONS.NContrato, '8005') NContrato,
          ISNULL(CONS.Contrato, 'PGP CONTINGENTE - ASMET SALUD EPS')Contrato,
          G.DayNumberOfMonth Dia,
          ISNULL(CONS.TotalEjecutado, 0) TotalEjecutado
          FROM 
          GCMDIMFECHA G LEFT JOIN(SELECT   
          GENDETCON.GDECODIGO As NContrato,
          GENDETCON.GDENOMBRE As Contrato,
          DAY(SLNORDSER.SOSFECORD) Dia,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO = '8005'
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND MONTH(SLNORDSER.SOSFECORD) = MONTH(GETDATE()) AND YEAR(SLNORDSER.SOSFECORD) = YEAR(GETDATE())
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, DAY(SLNORDSER.SOSFECORD)
        )AS CONS ON CONS.Dia = G.DayNumberOfMonth
          WHERE MONTH(G.DATE) = MONTH(GETDATE()) AND YEAR(G.DATE) = YEAR(GETDATE());`;
  } else {
    cn.ThrBadReqExc("El context no es valido");
  }
  try {
    const result = await cn.getDataSource(context).query(query);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
