import * as cn from "src/application/services/connection.service";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getGastoUrinario = async (dto: GetSabanasUCiDto, context: string): Promise<number> => {
  try {
    const result = await cn.getDataSource(context).query(
      `Select
      IIF(
          CONVERT(DATE, CONSOLIDADO.FECHA_REGISTRO, 103) = CONVERT(DATE, GETDATE(), 103),
          SUM(
              CONSOLIDADO.CANTIDAD / DATEPART(HOUR, GETDATE()) - HORAS_DIA.hora / NULLIF(CONSOLIDADO.PESO, 0)
          ),
          SUM(
              CONSOLIDADO.CANTIDAD / 24.0 / NULLIF(CONSOLIDADO.PESO, 0)
          )
      ) GASTO
  From
      HORAS_DIA -- TABLA CON LAS HORAS DEL DÍA
      Left Join (
          Select
              ADNINGRESO.OID,
              DatePart(HOUR, HCNLIQELM.HCRHORREG) HORAREG,
              HCNTIPLQEL.HCLNOMBRE LIQUIDO,
              HCNLIQELM.HCLCANTID CANTIDAD,
              HCNLIQELM.HCLPESO PESO,
              HCNREGENF.HCFECREG FECHA_REGISTRO
          From
              HCNREGENF
              Inner Join HCNLIQELM On HCNREGENF.OID = HCNLIQELM.HCNREGENF
              left Join ADNINGRESO On ADNINGRESO.OID = HCNREGENF.ADNINGRESO --LEFT JOIN HCNSIGVIT ON HCNREGENF.OID = HCNSIGVIT.HCNREGENF
              Inner Join HCNTIPLQEL On HCNTIPLQEL.OID = HCNLIQELM.HCNTIPLQEL
          WHERE
              HCNREGENF.HCFECREG = @1
              AND ADNINGRESO.AINCONSEC = @0
              AND HCNTIPLQEL.HCLNOMBRE = 'ORINA'
      ) As CONSOLIDADO On CONSOLIDADO.HORAREG = HORAS_DIA.hora
  WHERE
      HORAREG IS NOT NULL
  GROUP BY
      CONSOLIDADO.FECHA_REGISTRO;`,
      [dto.ingreso, dto.fecha]
    );
    if (result.length > 0) {
      return result[0].GASTO;
    } else {
      return 0;
    }
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
