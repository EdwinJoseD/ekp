import * as cn from "src/application/services/connection.service";
import { EstanciaPacienteI } from "../interfaces/estancia-paciente.interface";
import { GetEstanciasPacienteDto } from "../dtos/get-estancias-paciente.dto";

export const getEstanciasPaciente = async (
  dto: GetEstanciasPacienteDto,
  context: string
): Promise<EstanciaPacienteI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      H.HESFECING FECHAINGRESO,
      H.HESFECSAL FECHASALIDA,
      C.HCACODIGO CODIGOCAMA,
      -- H.OID,
      -- HESTIPOES,
      -- I.AINCONSEC,
      -- I.GENPACIEN,
      -- H.HPNDEFCAM,
      C.HCANOMBRE CAMA
  FROM
      HPNESTANC H
      INNER JOIN ADNINGRESO I ON H.ADNINGRES = I.OID
      INNER JOIN HPNDEFCAM C ON H.HPNDEFCAM = C.OID
  WHERE
      I.AINCONSEC = @0;`,
      [dto.ingreso]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
