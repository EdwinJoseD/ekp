import * as cn from "src/application/services/connection.service";
import { GetInfoGeneralDto } from "../dtos/get-info-general.dto";
import { RadicacionPendienteI } from "../interfaces/radicacion-pendiente.interface";

export const getRadicacionPendiente = async (
  dto: GetInfoGeneralDto,
  context: string
): Promise<RadicacionPendienteI> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT 
    COUNT(*) Cantidad,
    SUM((CC.CCVALOR + CC.CCVALDEB - (CC.CCVALCRE + CC.CCVALTRA + CC.CCVALABO))) Total
          FROM GCVRADFACTUR R
          LEFT JOIN CRNCXC C ON C.CXCDOCUME = R.SFANUMFAC
          LEFT JOIN CRNCXCC CC ON CC.CRNCXC = C.OID
          LEFT JOIN CRNACTENFACF AEF ON AEF.CRNCXC = C.OID
          LEFT JOIN CRNESTACTENT EAE ON EAE.OID = AEF.CRNESTACTENT
          WHERE
          CRNRADFACC IS NULL
          AND SFADOCANU = 0 
          AND SFATIPDOC IN(1, 16)
          AND CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
          AND (CC.CCVALOR + CC.CCVALDEB - (CC.CCVALCRE + CC.CCVALTRA + CC.CCVALABO)) > 0
          AND EAE.CRAENOMBRE IS NULL --ESTADO DE ENTREGA DE LA FACTURA`,
      [dto.inicioReporte, dto.finalReporte]
    );
    return result[0];
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
