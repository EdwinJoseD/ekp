import * as cn from "src/application/services/connection.service";
import { GetTotalEjecDiarioDto } from "../dtos/get-total-ejec-diario.dto";
import { PacienteConsolidadoI } from "../interfaces/pacientes-consolidado.interface";

export const getPacientesConsolidado = async (
  dto: GetTotalEjecDiarioDto,
  context: string
): Promise<PacienteConsolidadoI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
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
          ORDER BY TotalEjecutado DESC;`,
      [dto.contrato, dto.inicioReporte, dto.finalReporte]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
