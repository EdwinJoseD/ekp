import * as cn from "src/application/services/connection.service";
import { GetPacientesAcostadoDto } from "../dtos/get-pacientes-acostado.dto";
import { PacienteAcostadoI } from "../interfaces/pacientes-acostado.interface";

export const getPacientesAcostado = async (
  dto: GetPacientesAcostadoDto,
  context: string
): Promise<PacienteAcostadoI[]> => {
  let query: string = `SELECT 
  ADNINGRESO.AINCONSEC AS Ingreso,
  GENPACIEN.PACNUMDOC Identificacion,
  GENPACIEN.GPANOMCOM Paciente,
  ADNINGRESO.AINFECING,
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
AND MONTH(ADNINGRESO.AINFECING) = MONTH(GETDATE())-1
AND ADNINGRESO.AINFECFAC IS NULL
AND ADNINGRESO.ADNCENATE IN(@1, @2)
  GROUP BY 
    ADNINGRESO.AINCONSEC, 
    ADNINGRESO.AINURGCON,
    GENPACIEN.PACNUMDOC,
    GENPACIEN.GPANOMCOM,
    HPNDEFCAM.HCACODIGO,
    HPNDEFCAM.HCANOMBRE,
    ADNINGRESO.AINFECING
    ORDER BY TotalEjecutado DESC;`;
  if (dto.antiguedad === "actual") {
    query = `SELECT 
    ADNINGRESO.AINCONSEC AS Ingreso,
    GENPACIEN.PACNUMDOC Identificacion,
    GENPACIEN.GPANOMCOM Paciente,
    ADNINGRESO.AINFECING,
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
      --INNER JOIN HPNSUBGRU ON HPNSUBGRU.OID = HPNDEFCAM.HPNSUBGRU
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
      AND ADNINGRESO.ADNCENATE IN(@1, @2)
    GROUP BY 
      ADNINGRESO.AINCONSEC, 
      ADNINGRESO.AINURGCON,
      GENPACIEN.PACNUMDOC,
      GENPACIEN.GPANOMCOM,
      HPNDEFCAM.HCACODIGO,
      HPNDEFCAM.HCANOMBRE,
      ADNINGRESO.AINFECING
      ORDER BY TotalEjecutado DESC;`;
  }
  try {
    const result: PacienteAcostadoI[] = await cn
      .getDataSource(context)
      .query(query, [dto.contrato, dto.centro1, dto.centro2]);

    for (const i in result) {
      const estancias = await getEstanciasPaciente(result[i].Ingreso, context);
      result[i].Estancias = estancias;
    }
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};

const getEstanciasPaciente = async (ingreso: number, context: string): Promise<any> => {
  const result = await cn.getDataSource(context).query(
    `SELECT
      A.AINCONSEC Ingreso, 
      H.HESFECING FechaIngreso,
      H.HESFECSAL FechaSalida, 
      HCANOMBRE Grupo,
      HD.HCACODIGO Cama 
      FROM HPNESTANC H
      INNER JOIN ADNINGRESO A ON A.OID = H.ADNINGRES
      INNER JOIN HPNDEFCAM HD ON HD.OID = H.HPNDEFCAM
      WHERE A.AINCONSEC = @0;`,
    [ingreso]
  );
  return result;
};