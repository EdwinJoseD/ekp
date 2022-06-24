import * as cn from "src/application/services/connection.service";
import { GetMedicamentosDto } from "../dtos/get-medicamentos.dto";

export const getAllMedicamentos = async (dto: GetMedicamentosDto, context: string) => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      SLNPROHOJ.OID ID,
      INNPRODUC.IPRDESCOR,
      GENCONFAC.GCFCODIGO,
      GENCONFAC.GCFNOMBRE,
      SLNSERPRO.SERCANTID
  FROM
      SLNPROHOJ AS SLNPROHOJ
      INNER JOIN SLNSERPRO AS SLNSERPRO ON SLNSERPRO.OID = SLNPROHOJ.OID
      INNER JOIN ADNINGRESO AS ADNINGRESO ON ADNINGRESO.OID = SLNSERPRO.ADNINGRES1
      INNER JOIN INNPRODUC ON SLNPROHOJ.INNPRODUC1 = INNPRODUC.OID
      INNER JOIN GENCONFAC ON SLNPROHOJ.GENCONFAC = GENCONFAC.OID
  WHERE
      (ADNINGRESO.AINCONSEC = @0)`,
      [dto.ingreso]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
