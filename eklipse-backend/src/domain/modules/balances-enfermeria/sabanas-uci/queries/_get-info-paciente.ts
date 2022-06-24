import * as cn from "src/application/services/connection.service";
import { PacienteI } from "../interfaces/paciente.interface";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getInfoPaciente = async (dto: GetSabanasUCiDto, context: string): Promise<PacienteI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `Select
      TOP 1 --ADNINGRESO.OID,
      --HPNGRUPOS.HGRNOMBRE,
      --HCNREGENF.HCFECREG,
      ADNINGRESO.AINCONSEC,
      GENPACIEN.GPANOMCOM NOMBREPACIENTE,
      GENPACIEN.PACNUMDOC IDENTIFICACION,
      HPNDEFCAM.HCACODIGO CAMA,
      GENDETCON.GDENOMBRE CONTRATO,
      HCNREGENF.HCRPESO
  From
      ADNINGRESO
      Left Join HPNDEFCAM On HPNDEFCAM.OID = ADNINGRESO.HPNDEFCAM
      Left Join HPNSUBGRU On HPNSUBGRU.OID = HPNDEFCAM.HPNSUBGRU
      Left Join GENARESER On GENARESER.OID = HPNSUBGRU.GENARESER
      Left Join HPNGRUPOS On HPNGRUPOS.OID = HPNDEFCAM.HPNGRUPOS
      Left Join GENPACIEN On GENPACIEN.OID = ADNINGRESO.GENPACIEN
      Left Join HCNREGENF On ADNINGRESO.OID = HCNREGENF.ADNINGRESO
      Left Join GENDETCON On GENDETCON.OID = ADNINGRESO.GENDETCON
  Where
      ADNINGRESO.AINCONSEC = @0
      And HCNREGENF.HCFECREG = @1;`,
      [dto.ingreso, dto.fecha]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
