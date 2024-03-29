import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { GetPacientesAgrupadorDto } from "../dtos/get-pacientes-agrupador.dto";
import { PacientesAgrupadorI } from "../interfaces/pacientes-agrupador.interface";

export const getPacientesAgrupador = async (
  dto: GetPacientesAgrupadorDto,
  context: string
): Promise<PacientesAgrupadorI[]> => {
  let query: string;
  let parameters: any[] = [];
  const common = `SELECT 
  CONS.AINCONSEC Ingreso,
  CONS.GPANOMCOM Paciente,
  CONS.Agrupador,
  SUM(CONS.SFAVALCAR) AS TotalEjecutado,
  (SELECT CME FROM GCMFICHCON WHERE AGRUPADOR = CONS.Agrupador AND GDECODIGO = @2) Cme,
  SUM(CONS.SFAVALREC) AS TotalAnticipo,
  COUNT(CONS.AINCONSEC) Iteraciones
   FROM ADNINGRESO RIGHT JOIN 
  (SELECT  
  TOP 1 WITH TIES
  ISNULL(G.ORDEN, 0) ORDEN,
  ISNULL(G.AGRUPADOR, 'EVENTOS')AS Agrupador,
     ADNINGRESO.AINCONSEC,
     GENPACIEN.GPANOMCOM,
      SLNFACTUR.SFAVALCAR,
      SLNFACTUR.SFAVALREC
          FROM SLNFACTUR
           INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
           INNER JOIN GENPACIEN GENPACIEN ON GENPACIEN.OID = ADNINGRESO.GENPACIEN
           INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
           INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
           LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
           LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
           LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
           LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1`;
  if (context === ContextsE.VALLEDUPAR) {
    query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODCUP)) = G.COD_CUPS
    AND G.CONTRATO = @2
   WHERE 
   SLNFACTUR.SFATIPDOC = 17
   AND SLNFACTUR.SFADOCANU = N'0' 
   AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @0 AND @1
   AND GENDETCON.GDECODIGO = @2 --Contrato
   AND SLNORDSER.SOSESTADO = 1
   GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC, GPANOMCOM
   ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
   WHERE CONS.Agrupador = @3 --Agrupador
   GROUP BY CONS.Agrupador, CONS.AINCONSEC, CONS.GPANOMCOM
   ORDER BY TotalEjecutado DESC;`;
    parameters = [dto.inicioReporte, dto.finalReporte, dto.contrato1, dto.agrupador];
  } else if (context === ContextsE.ALTACENTRO) {
    if (["8005"].indexOf(dto.contrato1) >= 0) {
      query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = @2 
     WHERE 
     SLNFACTUR.SFATIPDOC = 17
     AND SLNFACTUR.SFADOCANU = N'0' 
     AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @3 AND @4
     AND GENDETCON.GDECODIGO BETWEEN @1 AND @2 --Contrato
     AND SLNORDSER.SOSESTADO = 1
     GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC, GPANOMCOM
     ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
     LEFT JOIN HPNDEFCAM H ON H.OID = ADNINGRESO.HPNDEFCAM
     WHERE CONS.Agrupador = @0 --Agrupador
     AND ADNINGRESO.ADNCENATE IN(@5, @6)
     GROUP BY CONS.Agrupador, CONS.AINCONSEC, CONS.GPANOMCOM
     ORDER BY TotalEjecutado DESC;`;
      parameters = [
        dto.agrupador,
        dto.contrato1,
        dto.contrato2,
        dto.inicioReporte,
        dto.finalReporte,
        dto.centro1,
        dto.centro2,
      ];
    } else if (["8009"].indexOf(dto.contrato1) >= 0) {
      query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = '8010'
     WHERE 
     SLNFACTUR.SFATIPDOC = 17
     AND SLNFACTUR.SFADOCANU = N'0' 
     AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @3 AND @4
     AND GENDETCON.GDECODIGO BETWEEN @1 AND @2 --Contrato
     AND SLNORDSER.SOSESTADO = 1
     GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC, GPANOMCOM
     ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
     LEFT JOIN HPNDEFCAM H ON H.OID = ADNINGRESO.HPNDEFCAM
     WHERE CONS.Agrupador = @0 --Agrupador
     AND ADNINGRESO.ADNCENATE IN(@5, @6)
     GROUP BY CONS.Agrupador, CONS.AINCONSEC, CONS.GPANOMCOM
     ORDER BY TotalEjecutado DESC;`;
      parameters = [
        dto.agrupador,
        dto.contrato1,
        dto.contrato2,
        dto.inicioReporte,
        dto.finalReporte,
        dto.centro1,
        dto.centro2,
      ];
    } else {
      query = `SELECT 
      CONS.AINCONSEC Ingreso,
      CONS.GPANOMCOM Paciente,
      CONS.Agrupador,
      SUM(CONS.SFAVALCAR) AS TotalEjecutado,
      (SELECT CME FROM GCMFICHCON WHERE AGRUPADOR = CONS.Agrupador AND GDECODIGO = @1) Cme,
      SUM(CONS.SFAVALREC) AS TotalAnticipo,
      COUNT(CONS.AINCONSEC) Iteraciones
       FROM ADNINGRESO RIGHT JOIN 
      (SELECT  
      TOP 1 WITH TIES
      ISNULL(G.ORDEN, 0) ORDEN,
      ISNULL(G.AGRUPADOR, 'EVENTOS')AS Agrupador,
         ADNINGRESO.AINCONSEC,
         GENPACIEN.GPANOMCOM,
          SLNFACTUR.SFAVALCAR,
          SLNFACTUR.SFAVALREC
              FROM SLNFACTUR
               INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
               INNER JOIN GENPACIEN GENPACIEN ON GENPACIEN.OID = ADNINGRESO.GENPACIEN
               INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
               INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
               LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
               LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
               LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
               LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1
               LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
               AND G.CONTRATO = @1
              WHERE 
              SLNFACTUR.SFATIPDOC = 17
              AND SLNFACTUR.SFADOCANU = N'0' 
              AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @2 AND @3
              AND GENDETCON.GDECODIGO = @1 --Contrato
              AND SLNORDSER.SOSESTADO = 1
              GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC, GPANOMCOM
              ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
              LEFT JOIN HPNDEFCAM H ON H.OID = ADNINGRESO.HPNDEFCAM
              WHERE CONS.Agrupador = @0 --Agrupador
              AND ADNINGRESO.ADNCENATE IN(@4, @5)
              GROUP BY CONS.Agrupador, CONS.AINCONSEC, CONS.GPANOMCOM
              ORDER BY TotalEjecutado DESC;`;
      parameters = [
        dto.agrupador,
        dto.contrato1,
        dto.inicioReporte,
        dto.finalReporte,
        dto.centro1,
        dto.centro2,
      ];
    }
  } else if (context === ContextsE.AGUACHICA) {
    if (["8003 - 8004"].indexOf(dto.contrato1) >= 0) {
      query = `SELECT 
      CONS.AINCONSEC Ingreso,
      CONS.GPANOMCOM Paciente,
      CONS.Agrupador,
      SUM(CONS.SFAVALCAR) AS TotalEjecutado,
      (SELECT CME FROM GCMFICHCON WHERE AGRUPADOR = CONS.Agrupador AND GDECODIGO = '8004') Cme,
      SUM(CONS.SFAVALREC) AS TotalAnticipo,
      COUNT(CONS.AINCONSEC) Iteraciones
       FROM ADNINGRESO RIGHT JOIN 
      (SELECT  
      TOP 1 WITH TIES
      ISNULL(G.ORDEN, 0) ORDEN,
      ISNULL(G.AGRUPADOR, 'EVENTOS')AS Agrupador,
         ADNINGRESO.AINCONSEC,
         GENPACIEN.GPANOMCOM,
          SLNFACTUR.SFAVALCAR,
          SLNFACTUR.SFAVALREC
              FROM SLNFACTUR
               INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
               INNER JOIN GENPACIEN GENPACIEN ON GENPACIEN.OID = ADNINGRESO.GENPACIEN
               INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
               INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
               LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
               LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
               LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
               LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1
               LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
               AND G.CONTRATO = '8004'
              WHERE 
              SLNFACTUR.SFATIPDOC = 17
              AND SLNFACTUR.SFADOCANU = N'0' 
              AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @2 AND @3
              AND GENDETCON.GDECODIGO IN('8004', '8003') --Contrato
              AND SLNORDSER.SOSESTADO = 1
              GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC, GPANOMCOM
              ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
              LEFT JOIN HPNDEFCAM H ON H.OID = ADNINGRESO.HPNDEFCAM
              WHERE CONS.Agrupador = @0 --Agrupador
              GROUP BY CONS.Agrupador, CONS.AINCONSEC, CONS.GPANOMCOM
              ORDER BY TotalEjecutado DESC;`;
      parameters = [dto.agrupador, dto.contrato1, dto.inicioReporte, dto.finalReporte];
    } else {
      query = `SELECT 
      CONS.AINCONSEC Ingreso,
      CONS.GPANOMCOM Paciente,
      CONS.Agrupador,
      SUM(CONS.SFAVALCAR) AS TotalEjecutado,
      (SELECT CME FROM GCMFICHCON WHERE AGRUPADOR = CONS.Agrupador AND GDECODIGO = @1) Cme,
      SUM(CONS.SFAVALREC) AS TotalAnticipo,
      COUNT(CONS.AINCONSEC) Iteraciones
       FROM ADNINGRESO RIGHT JOIN 
      (SELECT  
      TOP 1 WITH TIES
      ISNULL(G.ORDEN, 0) ORDEN,
      ISNULL(G.AGRUPADOR, 'EVENTOS')AS Agrupador,
         ADNINGRESO.AINCONSEC,
         GENPACIEN.GPANOMCOM,
          SLNFACTUR.SFAVALCAR,
          SLNFACTUR.SFAVALREC
              FROM SLNFACTUR
               INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
               INNER JOIN GENPACIEN GENPACIEN ON GENPACIEN.OID = ADNINGRESO.GENPACIEN
               INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
               INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
               LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
               LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
               LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
               LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1
               LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
               AND G.CONTRATO = @1
              WHERE 
              SLNFACTUR.SFATIPDOC = 17
              AND SLNFACTUR.SFADOCANU = N'0' 
              AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @2 AND @3
              AND GENDETCON.GDECODIGO = @1 --Contrato
              AND SLNORDSER.SOSESTADO = 1
              GROUP BY G.AGRUPADOR, G.ORDEN, ADNINGRESO.AINCONSEC, SLNFACTUR.SFAVALCAR, SLNFACTUR.SFAVALREC, GPANOMCOM
              ORDER BY ROW_NUMBER() OVER(PARTITION BY ADNINGRESO.AINCONSEC ORDER BY G.ORDEN DESC))  CONS ON CONS.AINCONSEC = ADNINGRESO.AINCONSEC 
              LEFT JOIN HPNDEFCAM H ON H.OID = ADNINGRESO.HPNDEFCAM
              WHERE CONS.Agrupador = @0 --Agrupador
              GROUP BY CONS.Agrupador, CONS.AINCONSEC, CONS.GPANOMCOM
              ORDER BY TotalEjecutado DESC;`;
      parameters = [dto.agrupador, dto.contrato1, dto.inicioReporte, dto.finalReporte];
    }
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
