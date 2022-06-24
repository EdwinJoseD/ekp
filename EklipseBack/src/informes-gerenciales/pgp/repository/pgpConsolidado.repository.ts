import { Inject, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

export class PgpConsolidado {
  private pgpRepository: Connection;
  private conexion: string;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.pgpRepository = getManager(this.conexion).connection;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  /**
   *
   * @param fechaInicio Fecha Inicial
   * @param fechaFin Fecha Final
   * @returns Contratos Consolidados discriminados
   */
  async Contratos(fechaInicio: string, fechaFin: string) {
    if (this.conexion === 'VDP') {
      return await this.pgpRepository.manager.query(
        `SELECT 
        CONS.NContrato,
        CONS.Contrato,
        SUM(CONS.TotalEjecutado) TotalEjecutado,
        MAX(CONS.TotalFacturado) TotalFacturado,
        SUM(CONS.Iteraciones) Iteraciones,
        ISNULL(ROUND ( MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado), 2 ),0) ErrorAbsoluto,
        ROUND( ((MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado))/NULLIF(MAX(CONS.TotalFacturado), 0))*100,2) ErrorRelativo,
        ROUND(((SUM(CONS.TotalEjecutado) / NULLIF(MAX(CONS.TotalFacturado),0))*100), 2) Porcentaje
        FROM GENDETCON
        RIGHT JOIN(
        SELECT   
          'ACOST' ESTADO,
          GENDETCON.GDECODIGO As NContrato,
          GENDETCON.GDENOMBRE As Contrato,
          COUNT(DISTINCT(ADNINGRESO.AINCONSEC)) Iteraciones,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
          ISNULL(G.LIMITE, 0) TotalFacturado
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
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
          UNION
        Select
          'FACT' ESTADO,
          GENDETCON.GDECODIGO As NContrato,
          GENDETCON.GDENOMBRE As Contrato,
          COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
          SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
          ISNULL(G.LIMITE, 0) TotalFacturado
        From SLNFACTUR SLNFACTUR
          Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
          Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
          LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
          LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
          LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
        Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 AND @1
          AND  SLNFACTUR.SFADOCANU = N'0'
          and SLNFACTUR.SFATIPDOC = 17
          AND GENDETCON.GDECODIGO = 'I202'
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE)AS CONS ON CONS.NContrato = GENDETCON.GDECODIGO
        GROUP BY CONS.NContrato, CONS.Contrato
        ORDER BY CONS.NContrato`,
        [fechaInicio, fechaFin]
      );
    }
    if (this.conexion === 'AC') {
      return await this.pgpRepository.manager.query(
        `SELECT 
      CONS.NContrato,
      CONS.Contrato,
      SUM(CONS.TotalEjecutado) TotalEjecutado,
      MAX(CONS.TotalFacturado) TotalFacturado,
      SUM(CONS.Iteraciones) Iteraciones,
      ISNULL(ROUND ( MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado), 2 ),0) ErrorAbsoluto,
      ROUND( ((MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado))/NULLIF(MAX(CONS.TotalFacturado), 0))*100,2) ErrorRelativo,
      ROUND(((SUM(CONS.TotalEjecutado) / NULLIF(MAX(CONS.TotalFacturado),0))*100), 2) Porcentaje
      FROM GENDETCON
      RIGHT JOIN(
      SELECT   
        'ACOST' ESTADO,
        GENDETCON.GDECODIGO As NContrato,
        GENDETCON.GDENOMBRE As Contrato,
        COUNT(DISTINCT(ADNINGRESO.AINCONSEC)) Iteraciones,
        SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      FROM HPNESTANC
        INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
          INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
          INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
          INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
          LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
          LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
          LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
        WHERE GENDETCON.GDECODIGO BETWEEN '8001' AND '8010'
          AND ADNINGRESO.AINESTADO = 0 
          AND SLNORDSER.SOSESTADO <> 2
          AND HPNDEFCAM.HCAESTADO = 2
          AND HPNESTANC.HESFECSAL IS NULL
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
        UNION
      Select
        'FACT' ESTADO,
        GENDETCON.GDECODIGO As NContrato,
        GENDETCON.GDENOMBRE As Contrato,
        COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
        SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      From SLNFACTUR SLNFACTUR
        Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
        Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
        LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
        LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
        LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
      Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
        AND  SLNFACTUR.SFADOCANU = N'0'
        and SLNFACTUR.SFATIPDOC = 17
        AND GENDETCON.GDECODIGO BETWEEN '8001' AND '8010'
      GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE)AS CONS ON CONS.NContrato = GENDETCON.GDECODIGO
      GROUP BY CONS.NContrato, CONS.Contrato
      ORDER BY CONS.NContrato`,
        [fechaInicio, fechaFin]
      );
    }
    if (this.conexion === 'AGU') {
      return this.pgpRepository.manager.query(
        `
      SELECT 
      CONS.NContrato,
      CONS.Contrato,
      SUM(CONS.TotalEjecutado) TotalEjecutado,
      MAX(CONS.TotalFacturado) TotalFacturado,
      SUM(CONS.Iteraciones) Iteraciones,
      ISNULL(ROUND ( MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado), 2 ),0) ErrorAbsoluto,
      ROUND( ((MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado))/NULLIF(MAX(CONS.TotalFacturado), 0))*100,2) ErrorRelativo,
      ROUND(((SUM(CONS.TotalEjecutado) / NULLIF(MAX(CONS.TotalFacturado),0))*100), 2) Porcentaje
      FROM GENDETCON
      RIGHT JOIN(
      (SELECT   
        'ACOST' ESTADO,
        GENDETCON.GDECODIGO As NContrato,
        GENDETCON.GDENOMBRE As Contrato,
        COUNT(DISTINCT(ADNINGRESO.AINCONSEC)) Iteraciones,
        SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      FROM HPNESTANC
        INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
          INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
          INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
          INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
          LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
          LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
          LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
        WHERE GENDETCON.GDECODIGO IN('8000', '8001', '8002', '8005')
          AND ADNINGRESO.AINESTADO = 0 
          AND SLNORDSER.SOSESTADO <> 2
          AND HPNDEFCAM.HCAESTADO = 2
          AND HPNESTANC.HESFECSAL IS NULL
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
		UNION
		SELECT   
        'ACOST' ESTADO,
        '8003 - 8004' As NContrato,
        'PGP ASMET SALUD EPS - SUBS - CONTR' As Contrato,
        COUNT(DISTINCT(ADNINGRESO.AINCONSEC)) Iteraciones,
        SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      FROM HPNESTANC
        INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
          INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
          INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
          INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
          LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
          LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
          LEFT JOIN GCMLIMPGP G ON  G.GDECODIGO = '8004'
        WHERE GENDETCON.GDECODIGO IN ('8003', '8004')
          AND ADNINGRESO.AINESTADO = 0 
          AND SLNORDSER.SOSESTADO <> 2
          AND HPNDEFCAM.HCAESTADO = 2
          AND HPNESTANC.HESFECSAL IS NULL
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
		)
        UNION
      (Select
        'FACT' ESTADO,
        GENDETCON.GDECODIGO As NContrato,
        GENDETCON.GDENOMBRE As Contrato,
        COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
        SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      From SLNFACTUR SLNFACTUR
        Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
        Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
        LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
        LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
        LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
      Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
        AND  SLNFACTUR.SFADOCANU = N'0'
        and SLNFACTUR.SFATIPDOC = 17
        AND GENDETCON.GDECODIGO IN ('8000', '8001', '8002', '8005')
      GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
	  UNION
	  Select
        'FACT' ESTADO,
        '8003 - 8004' As NContrato,
        'PGP ASMET SALUD EPS - SUBS - CONTR' As Contrato,
        COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
        SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
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
      GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
	  )
	  )AS CONS ON CONS.NContrato = GENDETCON.GDECODIGO
      GROUP BY CONS.NContrato, CONS.Contrato
      ORDER BY CONS.NContrato`,
        [fechaInicio, fechaFin]
      );
    }
  }

  /**
   *
   * @param contrato Contrato para mostrar Pacientes
   * @param fechaInicio Fecha Inicial
   * @param fechaFin Fecha Final
   * @returns Pacinetes que pertenecen a un contrato
   */
  async Pacientes(contrato: string, fechaInicio: string, fechaFin: string) {
    return await this.pgpRepository.manager.query(
      `SELECT 
      'ACOSTADO' Estado,
        ADNINGRESO.AINCONSEC AS Ingreso,
        GENPACIEN.PACNUMDOC Identificacion,
        GENPACIEN.GPANOMCOM Paciente,
        ADNINGRESO.AINFECING FechaIngreso,
         DateDiff(DAY, ADNINGRESO.AINFECING, GetDate()) As DiasEstancia,
        CASE ADNINGRESO.AINURGCON
          WHEN -1 THEN 'NINGUNO'
          WHEN 0 THEN 'URGENCIAS'
          WHEN 1 THEN 'CONSULTA EXTERNA'
          WHEN 2 THEN 'NACIDO EN LA IPS'
          WHEN 3 THEN 'REMITIDO'
          WHEN 4 THEN 'HOSPITALIZACION DE URGENCIAS'
          WHEN 5 THEN 'HOSPITALIZACION'
          WHEN 6 THEN 'IMAGENES'
          WHEN 7 THEN 'LABORATORIO'
          WHEN 8 THEN 'URGENCIA GINECOLOGIA'
          WHEN 9 THEN 'QUIROFANO'
          WHEN 10 THEN 'CIRUGIA AMBULATORIA'
          WHEN 11 THEN 'CIRUGIA PROGRAMADA'
          WHEN 12 THEN 'UCI NEONATAL'
          WHEN 13 THEN 'UCI ADULTO'
          END AS TipoIngreso,
         HPNDEFCAM.HCACODIGO CodCama,
        HPNDEFCAM.HCANOMBRE Cama,
        SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) AS TotalEjecutado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
          INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
          INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
          INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
          LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
          LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
        WHERE GENDETCON.GDECODIGO = @0
          AND SLNORDSER.SOSESTADO <> 2
          AND ADNINGRESO.AINESTADO = 0
          AND HPNDEFCAM.HCAESTADO = 2
          AND HPNESTANC.HESFECSAL IS NULL
        GROUP BY 
          ADNINGRESO.AINCONSEC, 
          ADNINGRESO.AINURGCON,
          GENPACIEN.PACNUMDOC,
          GENPACIEN.GPANOMCOM,
          HPNDEFCAM.HCACODIGO,
          HPNDEFCAM.HCANOMBRE,
          ADNINGRESO.AINFECING
  UNION
  SELECT  
    'FACTURADO' Estado,
     ADNINGRESO.AINCONSEC Ingreso,
     GENPACIEN.PACNUMDOC Identificacion,
     GENPACIEN.GPANOMCOM Paciente,
     ADNINGRESO.AINFECING FechaIngreso,
      DateDiff(DAY, ADNINGRESO.AINFECING, GetDate()) As DiasEstancia,
      CASE ADNINGRESO.AINURGCON
          WHEN -1 THEN 'NINGUNO'
          WHEN 0 THEN 'URGENCIAS'
          WHEN 1 THEN 'CONSULTA EXTERNA'
          WHEN 2 THEN 'NACIDO EN LA IPS'
          WHEN 3 THEN 'REMITIDO'
          WHEN 4 THEN 'HOSPITALIZACION DE URGENCIAS'
          WHEN 5 THEN 'HOSPITALIZACION'
          WHEN 6 THEN 'IMAGENES'
          WHEN 7 THEN 'LABORATORIO'
          WHEN 8 THEN 'URGENCIA GINECOLOGIA'
          WHEN 9 THEN 'QUIROFANO'
          WHEN 10 THEN 'CIRUGIA AMBULATORIA'
          WHEN 11 THEN 'CIRUGIA PROGRAMADA'
          WHEN 12 THEN 'UCI NEONATAL'
          WHEN 13 THEN 'UCI ADULTO'
          END AS TipoIngreso,
      'EGRESÓ' CodCama,
      'EGRESÓ' Cama,
      SLNFACTUR.SFAVALCAR TotalEjecutado
      --SLNFACTUR.SFAVALREC
          FROM SLNFACTUR
           INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
           INNER JOIN GENPACIEN GENPACIEN ON GENPACIEN.OID = ADNINGRESO.GENPACIEN
           INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
           INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
           LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
           LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
           LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
           LEFT JOIN GENARESER GENARESER ON GENARESER.OID = SLNSERPRO.GENARESER1
          WHERE 
          SLNFACTUR.SFATIPDOC = 17
          AND SLNFACTUR.SFADOCANU = N'0' 
          AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @1 AND @2
          AND GENDETCON.GDECODIGO = @0 --Contrato
          AND SLNORDSER.SOSESTADO = 1
          GROUP BY ADNINGRESO.AINCONSEC,
               GENPACIEN.PACNUMDOC,
               GENPACIEN.GPANOMCOM,
               ADNINGRESO.AINFECING,
               ADNINGRESO.AINURGCON,
                 SLNFACTUR.SFAVALCAR
          ORDER BY TotalEjecutado DESC`,
      [contrato, fechaInicio, fechaFin]
    );
  }

  /**
   *
   * @param contrato1 Contrato para obtener agrupadores
   * @param fechaInicio Fecha Inicial
   * @param fechaFin Fecha Final
   * @returns Agrupadores de un contrato
   */
  async Agrupadores(contrato1: string, fechaInicio: string, fechaFin: string) {
    if (
      contrato1 == '8005' ||
      contrato1 == '8006' ||
      contrato1 == '8009' ||
      contrato1 == '8010'
    ) {
      return await this.pgpRepository.manager.query(
        `
        SELECT 
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
            ORDER BY CONS.ORDEN DESC`,
        [contrato1, fechaInicio, fechaFin]
      );
    } else {
      return await this.pgpRepository.manager.query(
        `
        SELECT 
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
            ORDER BY CONS.ORDEN DESC`,
        [contrato1, fechaInicio, fechaFin]
      );
    }
  }

  async diferencia(fechaInicio: string, fechaFin: string, centro1, centro2) {
    if (this.conexion === 'AC') {
      return await this.pgpRepository.manager.query(
        `SELECT 
        CASE WHEN CONS.NContrato = '8006' THEN '8005 - 8006' ELSE CONS.NContrato
        END NContrato,
      CONS.ErrorAbsoluto Diferencia
      FROM 
      GENDETCON RIGHT JOIN(
      SELECT 
      CONS.NContrato,
      CONS.Contrato,
      SUM(CONS.TotalEjecutado) TotalEjecutado,
      MAX(CONS.TotalFacturado) TotalFacturado,
      SUM(CONS.Iteraciones) Iteraciones,
      ISNULL(ROUND ( MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado), 2 ),0) ErrorAbsoluto,
      ROUND( ((MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado))/NULLIF(MAX(CONS.TotalFacturado), 0))*100,2) ErrorRelativo,
      ROUND(((SUM(CONS.TotalEjecutado) / NULLIF(MAX(CONS.TotalFacturado),0))*100), 2) Porcentaje
      FROM GENDETCON
      RIGHT JOIN(
      SELECT   
        'ACOST' ESTADO,
        GENDETCON.GDECODIGO As NContrato,
        GENDETCON.GDENOMBRE As Contrato,
        COUNT(DISTINCT(ADNINGRESO.AINCONSEC)) Iteraciones,
        SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      FROM HPNESTANC
        INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
          INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
          INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
          INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
          LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
          LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
          LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
        WHERE GENDETCON.GDECODIGO BETWEEN '8001' AND '8010'
          AND ADNINGRESO.AINESTADO = 0 
          AND SLNORDSER.SOSESTADO <> 2
          AND HPNDEFCAM.HCAESTADO = 2
          AND HPNESTANC.HESFECSAL IS NULL
          AND HPNDEFCAM.ADNCENATE IN(@2, @3)
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
        UNION
      Select
        'FACT' ESTADO,
        GENDETCON.GDECODIGO As NContrato,
        GENDETCON.GDENOMBRE As Contrato,
        COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
        SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
        ISNULL(G.LIMITE, 0) TotalFacturado
      From SLNFACTUR SLNFACTUR
        Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
        Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
        LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
        LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
        LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
      Where SLNFACTUR.SFAFECFAC Between @0 And @1
        AND  SLNFACTUR.SFADOCANU = N'0'
        and SLNFACTUR.SFATIPDOC = 17
        AND GENDETCON.GDECODIGO BETWEEN '8001' AND '8010'
        AND ADNINGRESO.ADNCENATE IN(@2 ,@3)
      GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE)AS CONS ON CONS.NContrato = GENDETCON.GDECODIGO
      GROUP BY CONS.NContrato, CONS.Contrato)CONS ON CONS.NContrato = GENDETCON.GDECODIGO 
      WHERE GENDETCON.GDECODIGO IN('8001', '8006', '8009', '8010')
      ORDER BY CONS.nContrato`,
        [fechaInicio, fechaFin, centro1, centro2]
      );
    }
    if (this.conexion === 'AGU') {
      return this.pgpRepository.manager.query(
        `SELECT 
        CONS.NContrato,
        ISNULL(ROUND ( MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado), 2 ),0) Diferencia
        FROM GENDETCON
        RIGHT JOIN(
        (SELECT   
          GENDETCON.GDECODIGO As NContrato,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
          ISNULL(G.LIMITE, 0) TotalFacturado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON GENDETCON.GDECODIGO = G.GDECODIGO
          WHERE GENDETCON.GDECODIGO IN('8000', '8001', '8002', '8005')
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
      UNION
      SELECT   
          '8003 - 8004' As NContrato,
          SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
          ISNULL(G.LIMITE, 0) TotalFacturado
        FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
            INNER JOIN ADNINGRESO ON HPNESTANC.ADNINGRES = ADNINGRESO.OID
            INNER JOIN GENPACIEN ON ADNINGRESO.GENPACIEN = GENPACIEN.OID
            INNER JOIN GENDETCON ON ADNINGRESO.GENDETCON = GENDETCON.OID
            LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
            LEFT Join SLNORDSER On SLNORDSER.OID = SLNSERPRO.SLNORDSER1
            LEFT JOIN GCMLIMPGP G ON  G.GDECODIGO = '8004'
          WHERE GENDETCON.GDECODIGO IN ('8003', '8004')
            AND ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
      )
          UNION
        (Select
          GENDETCON.GDECODIGO As NContrato,
          SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
          ISNULL(G.LIMITE, 0) TotalFacturado
        From SLNFACTUR SLNFACTUR
          Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
          Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
          LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
          LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
          LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
        Where CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) Between @0 And @1
          AND  SLNFACTUR.SFADOCANU = N'0'
          and SLNFACTUR.SFATIPDOC = 17
          AND GENDETCON.GDECODIGO IN ('8000', '8001', '8002', '8005')
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
      UNION
      Select
          '8003 - 8004' As NContrato,
          SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
          ISNULL(G.LIMITE, 0) TotalFacturado
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
        GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
      )
      )AS CONS ON CONS.NContrato = GENDETCON.GDECODIGO
        GROUP BY CONS.NContrato
        ORDER BY CONS.NContrato`,
        [fechaInicio, fechaFin]
      );
    }
    if (this.conexion === 'VDP') {
      return this.pgpRepository.manager.query(
        `SELECT   
        CONS.NContrato,
          CONS.ErrorAbsoluto Diferencia
          FROM 
          GENDETCON RIGHT JOIN(
          SELECT 
          CONS.NContrato,
          CONS.Contrato,
          SUM(CONS.TotalEjecutado) TotalEjecutado,
          MAX(CONS.TotalFacturado) TotalFacturado,
          SUM(CONS.Iteraciones) Iteraciones,
          ISNULL(ROUND ( MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado), 2 ),0) ErrorAbsoluto,
          ROUND( ((MAX(CONS.TotalFacturado)-SUM(CONS.TotalEjecutado))/NULLIF(MAX(CONS.TotalFacturado), 0))*100,2) ErrorRelativo,
          ROUND(((SUM(CONS.TotalEjecutado) / NULLIF(MAX(CONS.TotalFacturado),0))*100), 2) Porcentaje
          FROM GENDETCON
          RIGHT JOIN(
          SELECT   
            'ACOST' ESTADO,
            GENDETCON.GDECODIGO As NContrato,
            GENDETCON.GDENOMBRE As Contrato,
            COUNT(DISTINCT(ADNINGRESO.AINCONSEC)) Iteraciones,
            SUM(SLNSERPRO.SERCANTID * SLNSERPRO.SERVALPRO) TotalEjecutado,
            ISNULL(G.LIMITE, 0) TotalFacturado
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
            GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE
            UNION
          Select
            'FACT' ESTADO,
            GENDETCON.GDECODIGO As NContrato,
            GENDETCON.GDENOMBRE As Contrato,
            COUNT(SLNFACTUR.SFATOTFAC) Iteraciones,
            SUM(SLNFACTUR.SFAVALCAR) TotalEjecutado,
            ISNULL(G.LIMITE, 0) TotalFacturado
          From SLNFACTUR SLNFACTUR
            Inner Join ADNINGRESO ADNINGRESO On ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
            Inner Join GENDETCON GENDETCON On GENDETCON.OID = SLNFACTUR.GENDETCON
            LEFT JOIN HPNDEFCAM E ON ADNINGRESO.HPNDEFCAM = E.OID
            LEFT JOIN HPNSUBGRU F ON F.OID = E.HPNSUBGRU
            LEFT JOIN GCMLIMPGP G ON G.GDECODIGO = GENDETCON.GDECODIGO
          Where SLNFACTUR.SFAFECFAC Between @0 AND @1
            AND  SLNFACTUR.SFADOCANU = N'0'
            and SLNFACTUR.SFATIPDOC = 17
            AND GENDETCON.GDECODIGO = 'I202'
          GROUP BY GENDETCON.GDECODIGO, GENDETCON.GDENOMBRE, G.LIMITE)AS CONS ON CONS.NContrato = GENDETCON.GDECODIGO
          GROUP BY CONS.NContrato, CONS.Contrato)CONS ON CONS.NContrato = GENDETCON.GDECODIGO 
          WHERE GENDETCON.GDECODIGO IN('I202')
          ORDER BY CONS.nContrato`,
        [fechaInicio, fechaFin]
      );
    }
  }
}