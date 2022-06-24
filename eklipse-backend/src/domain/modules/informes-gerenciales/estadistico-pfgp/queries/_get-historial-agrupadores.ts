import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { GetHistorialAgrupadoresDto } from "../dtos/get-historial-agrupadores.dto";
import { HistorialAgrupadorI } from "../interfaces/historial-agrupador.interface";

export const getHistorialAgrupadores = async (
  dto: GetHistorialAgrupadoresDto,
  context: string
): Promise<HistorialAgrupadorI[]> => {
  let query: string;
  let parameters: any[] = [];
  const common = `SELECT 
  ISNULL(G.AGRUPADOR, 'EVENTOS')Agrupador,
  SUM(SLNSERPRO.SERCANTID * (SLNSERPRO.SERVALENT + SLNSERPRO.SERVALPAC)) AS TotalEjecutado
 FROM SLNFACTUR SLNFACTUR
  INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = SLNFACTUR.ADNINGRESO
  INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = SLNFACTUR.GENDETCON
  INNER JOIN SLNSERPRO SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
  INNER JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
  LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
  LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1`;
  if (context === ContextsE.VALLEDUPAR) {
    query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODCUP)) = G.COD_CUPS
    AND G.CONTRATO = 'I202'
   WHERE 
    SLNFACTUR.SFATIPDOC = 17
    AND SLNFACTUR.SFADOCANU = N'0' 
    AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @1 AND @2
    AND GENDETCON.GDECODIGO = 'I202'
    AND SLNORDSER.SOSESTADO = 1
    AND ADNINGRESO.AINCONSEC = @0	
    GROUP BY 
    ADNINGRESO.AINCONSEC, G.AGRUPADOR, G.ORDEN
    ORDER BY ADNINGRESO.AINCONSEC, G.ORDEN DESC;`;
    parameters = [dto.ingreso, dto.inicioReporte, dto.finalReporte];
  } else if (context === ContextsE.ALTACENTRO) {
    if (["8001", "8010"].indexOf(dto.contrato) >= 0) {
      query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = @0
     WHERE 
      SLNFACTUR.SFATIPDOC = 17
      AND SLNFACTUR.SFADOCANU = N'0' 
      AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @2 AND @3
      AND GENDETCON.GDECODIGO BETWEEN '8001' AND '8010'
      AND SLNORDSER.SOSESTADO = 1
      AND ADNINGRESO.AINCONSEC = @1	
      GROUP BY 
      ADNINGRESO.AINCONSEC, G.AGRUPADOR, G.ORDEN
      ORDER BY ADNINGRESO.AINCONSEC, G.ORDEN DESC;`;
      parameters = [dto.contrato, dto.ingreso, dto.inicioReporte, dto.finalReporte];
    } else if (["8005", "8005 - 8006", "8009"].indexOf(dto.contrato) >= 0) {
      query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = '8006'
     WHERE 
      SLNFACTUR.SFATIPDOC = 17
      AND SLNFACTUR.SFADOCANU = N'0' 
      AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @1 AND @2
      AND GENDETCON.GDECODIGO BETWEEN '8001' AND '8010'
      AND SLNORDSER.SOSESTADO = 1
      AND ADNINGRESO.AINCONSEC = @0	
      GROUP BY 
      ADNINGRESO.AINCONSEC, G.AGRUPADOR, G.ORDEN
      ORDER BY ADNINGRESO.AINCONSEC, G.ORDEN DESC;`;
      parameters = [dto.ingreso, dto.inicioReporte, dto.finalReporte];
    } else {
      cn.ThrBadReqExc("El contrato no es valido");
    }
  } else if (context === ContextsE.AGUACHICA) {
    if (["8000", "8005"].indexOf(dto.contrato) >= 0) {
      query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = @0
     WHERE 
      SLNFACTUR.SFATIPDOC = 17
      AND SLNFACTUR.SFADOCANU = N'0' 
      AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @2 AND @3
      AND GENDETCON.GDECODIGO BETWEEN '8000' AND '8005'
      AND SLNORDSER.SOSESTADO = 1
      AND ADNINGRESO.AINCONSEC = @1	
      GROUP BY 
      ADNINGRESO.AINCONSEC, G.AGRUPADOR, G.ORDEN
      ORDER BY ADNINGRESO.AINCONSEC, G.ORDEN DESC;`;
      parameters = [dto.contrato, dto.ingreso, dto.inicioReporte, dto.finalReporte];
    } else if (["8003", "8004"].indexOf(dto.contrato) >= 0) {
      query = `${common} LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = '8004'
     WHERE 
      SLNFACTUR.SFATIPDOC = 17
      AND SLNFACTUR.SFADOCANU = N'0' 
      AND CONVERT(DATE, SLNFACTUR.SFAFECFAC, 103) BETWEEN @1 AND @2
      AND GENDETCON.GDECODIGO BETWEEN '8000' AND '8005'
      AND SLNORDSER.SOSESTADO = 1
      AND ADNINGRESO.AINCONSEC = @0	
      GROUP BY 
      ADNINGRESO.AINCONSEC, G.AGRUPADOR, G.ORDEN
      ORDER BY ADNINGRESO.AINCONSEC, G.ORDEN DESC;`;
      parameters = [dto.ingreso, dto.inicioReporte, dto.finalReporte];
    } else {
      cn.ThrBadReqExc("El contrato no es valido");
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
