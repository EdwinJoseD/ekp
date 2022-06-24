import * as cn from "src/application/services/connection.service";
import { GetTotalEjecDiarioDto } from "../dtos/get-total-ejec-diario.dto";

export const getAgrupadoresContrato = async (dto: GetTotalEjecDiarioDto, context: string) => {
  let query: string;
  let parameters: any[] = [dto.contrato, dto.inicioReporte, dto.finalReporte];
  if (["8005", "8006", "8009", "8010"].indexOf(dto.contrato) >= 0) {
    query = `SELECT 
    CONS.Agrupador,
    SUM(CONS.TotalCargado) TotalCargado,
    CONS.TotalFacturado TotalContratado,
    CONS.TotalFacturado-SUM(CONS.TotalCargado) ErrorAbsoluto,
    ROUND(((CONS.TotalFacturado-SUM(CONS.TotalCargado))/NULLIF(CONS.TotalFacturado, 0))*100, 2) ErrorRelativo,
    ROUND((SUM(CONS.TotalCargado)/NULLIF(CONS.TotalFacturado, 0))*100, 2) Porcentaje
    FROM GCMFICHCON F RIGHT JOIN(
    SELECT 
    F.ORDEN,
    F.AGRUPADOR Agrupador,
    ISNULL(CONS.TotalCargado, 0) TotalCargado,
    F.TOTALFACTURADO TotalFacturado
    FROM GCMFICHCON F LEFT JOIN
    (SELECT  
       ISNULL(G.ORDEN, 0) ORDEN,
       ISNULL(G.AGRUPADOR, 'EVENTOS')AS Agrupador,
       SUM(SLNSERPRO.SERVALPRO * SLNSERPRO.SERCANTID) TotalCargado
            FROM HPNESTANC
            INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = HPNESTANC.ADNINGRES
            INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = ADNINGRESO.GENDETCON
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
            LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
            LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
            WHERE 
               ADNINGRESO.AINESTADO = 0 
              AND SLNORDSER.SOSESTADO <> 2
              AND HPNDEFCAM.HCAESTADO = 2
              AND HPNESTANC.HESFECSAL IS NULL
              AND GENDETCON.GDECODIGO BETWEEN @0 AND @0
            GROUP BY 
            G.AGRUPADOR, G.ORDEN
            )AS CONS ON F.AGRUPADOR = CONS.AGRUPADOR
            WHERE F.GDECODIGO =  '8010'
            union
            SELECT 
            F.ORDEN,
    F.AGRUPADOR Agrupador,
    ISNULL(SUM(CONS.SFAVALCAR),0) TotalCargado,
    F.TOTALFACTURADO TotalFacturado
     FROM ADNINGRESO RIGHT JOIN 
    (SELECT  
    TOP 1 WITH TIES
    ISNULL(G.ORDEN, 0) ORDEN,
       ISNULL(G.AGRUPADOR, 'EVENTOS')AS AGRUPADOR,
       ADNINGRESO.AINCONSEC,
        SLNFACTUR.SFAVALCAR,
        SLNFACTUR.SFAVALREC
            FROM SLNFACTUR
             INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
             INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
             INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
             LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
             LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
             LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
             LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1
             LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS		   
            WHERE 
            SLNFACTUR.SFATIPDOC = 17
            AND SLNFACTUR.SFADOCANU = N'0' 
            AND "SLNFACTUR"."SFAFECFAC" BETWEEN @1 AND @2
            AND GENDETCON.GDECODIGO BETWEEN @0 AND @0
            AND SLNORDSER.SOSESTADO = 1
            GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC
            ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
            RIGHT JOIN GCMFICHCON F ON F.AGRUPADOR = CONS.AGRUPADOR
            WHERE F.GDECODIGO =  '8010'
            GROUP BY F.AGRUPADOR, F.ORDEN, F.TOTALFACTURADO, F.NEVENTOS) AS CONS ON CONS.Agrupador = F.AGRUPADOR
            WHERE F.GDECODIGO =  '8010'
            GROUP BY CONS.Agrupador, CONS.ORDEN, CONS.TotalFacturado
            ORDER BY CONS.ORDEN DESC`;
  } else {
    query = `SELECT 
    CONS.Agrupador,
    SUM(CONS.TotalCargado) TotalCargado,
    CONS.TotalFacturado TotalContratado,
    CONS.TotalFacturado-SUM(CONS.TotalCargado) ErrorAbsoluto,
    ROUND(((CONS.TotalFacturado-SUM(CONS.TotalCargado))/CONS.TotalFacturado)*100, 2) ErrorRelativo,
    ROUND((SUM(CONS.TotalCargado)/CONS.TotalFacturado)*100, 2) Porcentaje
    FROM GCMFICHCON F RIGHT JOIN(
    SELECT 
    F.ORDEN,
    F.AGRUPADOR Agrupador,
    ISNULL(CONS.TotalCargado, 0) TotalCargado,
    F.TOTALFACTURADO TotalFacturado
    FROM GCMFICHCON F LEFT JOIN
    (SELECT  
       ISNULL(G.ORDEN, 0) ORDEN,
       ISNULL(G.AGRUPADOR, 'EVENTOS')AS Agrupador,
       SUM(SLNSERPRO.SERVALPRO * SLNSERPRO.SERCANTID) TotalCargado
            FROM HPNESTANC
            INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = HPNESTANC.ADNINGRES
            INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = ADNINGRESO.GENDETCON
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
            LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
            LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
            WHERE 
               ADNINGRESO.AINESTADO = 0 
              AND SLNORDSER.SOSESTADO <> 2
              AND HPNDEFCAM.HCAESTADO = 2
              AND HPNESTANC.HESFECSAL IS NULL
              AND GENDETCON.GDECODIGO BETWEEN @0 AND @0
            GROUP BY 
            G.AGRUPADOR, G.ORDEN
            )AS CONS ON F.AGRUPADOR = CONS.AGRUPADOR
            WHERE F.GDECODIGO =  @0
            union
            SELECT 
            F.ORDEN,
    F.AGRUPADOR Agrupador,
    ISNULL(SUM(CONS.SFAVALCAR),0) TotalCargado,
    F.TOTALFACTURADO TotalFacturado
     FROM ADNINGRESO RIGHT JOIN 
    (SELECT  
    TOP 1 WITH TIES
    ISNULL(G.ORDEN, 0) ORDEN,
       ISNULL(G.AGRUPADOR, 'EVENTOS')AS AGRUPADOR,
       ADNINGRESO.AINCONSEC,
        SLNFACTUR.SFAVALCAR,
        SLNFACTUR.SFAVALREC
            FROM SLNFACTUR
             INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
             INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
             INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
             LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
             LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
             LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
             LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1
             LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS		   
            WHERE 
            SLNFACTUR.SFATIPDOC = 17
            AND SLNFACTUR.SFADOCANU = N'0' 
            AND "SLNFACTUR"."SFAFECFAC" BETWEEN @1 AND @2
            AND GENDETCON.GDECODIGO BETWEEN @0 AND @0
            AND SLNORDSER.SOSESTADO = 1
            GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC
            ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
            RIGHT JOIN GCMFICHCON F ON F.AGRUPADOR = CONS.AGRUPADOR
            WHERE F.GDECODIGO =  @0
            GROUP BY F.AGRUPADOR, F.ORDEN, F.TOTALFACTURADO, F.NEVENTOS) AS CONS ON CONS.Agrupador = F.AGRUPADOR
            WHERE F.GDECODIGO =  @0
            GROUP BY CONS.Agrupador, CONS.ORDEN, CONS.TotalFacturado
            ORDER BY CONS.ORDEN DESC`;
  }
  try {
    const result = await cn.getDataSource(context).query(query, parameters);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};