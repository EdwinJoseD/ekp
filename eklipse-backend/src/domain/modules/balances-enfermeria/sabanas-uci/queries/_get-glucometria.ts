import * as cn from "src/application/services/connection.service";
import { GlucometriaI } from "../interfaces/glucometria.interface";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getGlucometria = async (dto: GetSabanasUCiDto, context: string): Promise<GlucometriaI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `Select
      HORAS_DIA.HORA,
      CONSOLIDADO.RESULTADO --HORAS_DIA.OID ID,
      --CONSOLIDADO.HORAREG,
      --CONSOLIDADO.FECHA_REGISTRO_ENF,
      --CONSOLIDADO.INGRESO,
      --CONSOLIDADO.CAMA,
      --CONSOLIDADO.GRUPO_CAMA
  From
      HORAS_DIA
      Left Join (
          Select
              DatePart(HOUR, HCNGLUCOM.HCRHORREG) HORAREG,
              HCNGLUCOM.HCGRESGLU RESULTADO,
              Null As PESO,
              HCNREGENF.HCFECREG FECHA_REGISTRO_ENF,
              ADNINGRESO.AINCONSEC INGRESO,
              HPNDEFCAM.HCACODIGO CAMA,
              HPNGRUPOS.HGRNOMBRE GRUPO_CAMA
          From
              HCNREGENF
              Inner Join HCNGLUCOM On HCNREGENF.OID = HCNGLUCOM.HCNREGENF
              Inner Join ADNINGRESO On ADNINGRESO.OID = HCNREGENF.ADNINGRESO
              Left Join HPNDEFCAM On HPNDEFCAM.OID = ADNINGRESO.HPNDEFCAM
              Left Join HPNSUBGRU On HPNSUBGRU.OID = HPNDEFCAM.HPNSUBGRU
              Left Join GENARESER On GENARESER.OID = HPNSUBGRU.GENARESER
              Left Join HPNGRUPOS On HPNGRUPOS.OID = HPNDEFCAM.HPNGRUPOS
          Where
              HCNREGENF.HCFECREG = @1
              And (1 = 1)
              And ADNINGRESO.AINCONSEC = @0
      ) As CONSOLIDADO On CONSOLIDADO.HORAREG = HORAS_DIA.HORA`,
      [dto.ingreso, dto.fecha]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
