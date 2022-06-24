import * as cn from "src/application/services/connection.service";
import { GetFacturasSinRadicarDto } from "../dtos/get-facturas-sin-radicar.dto";
import { FacturaSinRadicarI } from "../interfaces/factura-sin-radicar.interface";

export const getFacturasSinRadicar = async (
  context: string,
  dto: GetFacturasSinRadicarDto
): Promise<FacturaSinRadicarI[]> => {
  try {
    let query: string;
    let parameters: any[];
    if (dto === null) {
      query = `SELECT 
      R.SFATIPDOC,
      R.SFANUMFAC, 
	    GT.TERNOMCOM,
      R.GDENOMBRE,
      R.SFAFECFAC,
	    (CC.CCVALOR + CC.CCVALDEB - (CC.CCVALCRE + CC.CCVALTRA + CC.CCVALABO)) SFATOTFAC,
      EAE.CRAENOMBRE
      FROM GCVRADFACTUR R
      LEFT JOIN CRNCXC C ON C.CXCDOCUME = R.SFANUMFAC
      LEFT JOIN CRNCXCC CC ON CC.CRNCXC = C.OID
      LEFT JOIN CRNACTENFACF AEF ON AEF.CRNCXC = C.OID
      LEFT JOIN CRNESTACTENT EAE ON EAE.OID = AEF.CRNESTACTENT
	    LEFT JOIN GENTERCER GT ON GT.OID = R.GENTERCER
      WHERE
      CRNRADFACC IS NULL
      AND SFADOCANU = 0 
      AND SFATIPDOC IN(0, 1, 16)
      AND CONVERT(DATE, SFAFECFAC, 103) > '01-01-2015'
      AND (CC.CCVALOR + CC.CCVALDEB - (CC.CCVALCRE + CC.CCVALTRA + CC.CCVALABO)) > 0
	    AND EAE.OID IS NULL
      ORDER BY SFAFECFAC`;
    } else {
      query = `SELECT
      SFANUMFAC,
      SFATIPDOC,
      SFAFECFAC,
      SFATOTFAC
      FROM GCVRADFACTUR 
      WHERE CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFADOCANU = 0
      AND SFATIPDOC IN(1, 16)
      AND CRFFECRAD IS NULL`;
      parameters = [dto.inicioReporte, dto.finalReporte];
    }
    const result = await cn.getDataSource(context).query(query, parameters);
    return result;
  } catch (error) {
    console.log(error);
    cn.ThrBadReqExc();
  }
};
