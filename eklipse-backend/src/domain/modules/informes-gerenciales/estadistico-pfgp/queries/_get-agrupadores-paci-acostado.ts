import * as cn from "src/application/services/connection.service";
import { ContextsE } from "src/application/enums/contexts.enum";
import { GetAgrupPaciAcostadoDto } from "../dtos/get-agrup-paci-acostado.dto";
import { AgrupadorPacienteI } from "../interfaces/agrupador-paciente.interface";

export const getAgrupadoresPacienteAcostado = async (
  dto: GetAgrupPaciAcostadoDto,
  context: string
): Promise<AgrupadorPacienteI[]> => {
  let query: string;
  let addCond: string;
  let parameters: any[] = [dto.contrato, dto.ingreso];
  if (context === ContextsE.VALLEDUPAR) {
    addCond = `LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODCUP)) = G.COD_CUPS
    AND G.CONTRATO = @0`;
  } else {
    if (["8005", "8006", "8009", "8010"].indexOf(dto.contrato) >= 0) {
      addCond = `LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = '8010'`;
    } else {
      addCond = `LEFT JOIN GCMAGRUPGP G ON RTrim(LTrim(GENSERIPS.SIPCODIGO)) = G.COD_SERIPS
      AND G.CONTRATO = @0`;
    }
  }
  query = `SELECT  
  ISNULL(G.ORDEN, 0) ORDEN,
     ISNULL(G.AGRUPADOR, 'EVENTOS')AS AGRUPADOR,
     ADNINGRESO.AINCONSEC,
     SUM(SLNSERPRO.SERVALPRO * SLNSERPRO.SERCANTID)SUMA
          FROM HPNESTANC
          INNER JOIN HPNDEFCAM ON HPNESTANC.HPNDEFCAM = HPNDEFCAM.OID
          INNER JOIN ADNINGRESO ADNINGRESO ON ADNINGRESO.OID = HPNESTANC.ADNINGRES
          INNER JOIN GENDETCON GENDETCON ON GENDETCON.OID = ADNINGRESO.GENDETCON
          LEFT JOIN SLNSERPRO ON SLNSERPRO.ADNINGRES1 = ADNINGRESO.OID
          LEFT JOIN SLNORDSER SLNORDSER ON SLNORDSER.OID = SLNSERPRO.SLNORDSER1
          LEFT JOIN SLNSERHOJ SLNSERHOJ ON SLNSERHOJ.OID = SLNSERPRO.OID
          LEFT JOIN GENSERIPS GENSERIPS ON GENSERIPS.OID = SLNSERHOJ.GENSERIPS1
          ${addCond} WHERE 
             ADNINGRESO.AINESTADO = 0 
            AND SLNORDSER.SOSESTADO <> 2
            AND HPNDEFCAM.HCAESTADO = 2
            AND HPNESTANC.HESFECSAL IS NULL
            AND GENDETCON.GDECODIGO = @0
            AND ADNINGRESO.AINCONSEC = @1
          GROUP BY ADNINGRESO.AINCONSEC, G.AGRUPADOR, G.ORDEN
          ORDER BY ADNINGRESO.AINCONSEC, G.ORDEN DESC;`;
  try {
    const result = await cn.getDataSource(context).query(query, parameters);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
