import * as cn from "src/application/services/connection.service";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getPerdidaInsensible = async (dto: GetSabanasUCiDto, context: string): Promise<number> => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      TOP 1 IIF(
          (
              DATEPART(YY, GETDATE()) = DATEPART(YY, HP.HESFECING)
              AND DATEPART(MM, GETDATE()) = DATEPART(MM, HP.HESFECING)
              AND DATEPART(DD, GETDATE()) = DATEPART(DD, HP.HESFECING)
          ),
          --ES EL MISMO DIA    ((DATEPART(HOUR, GETDATE())) - 7)
          IIF(
              HC.HCCM09N61 = 'SI',
              --¿ UCI ?
              IIF(
                  HC.HCCM09N62 = 'SI',
                  -- ¿ ESTA VENTILADO ?
                  IIF(
                      HC.HCCM09N63 = 'SI',
                      -- ¿ ESTA QUEMADO ?
                      IIF(
                          TEMP.HCSVALOR > 38.4,
                          (
                              (
                                  0.20 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                              ) * 2 +(
                                  0.25 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                              ) +(
                                  0.5 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                              )
                          ),
                          --VALOR VENTILADO Y QUEMADO Y FIEBRE
                          (
                              (
                                  0.20 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                              ) +(
                                  0.25 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                              ) +(
                                  0.5 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                              )
                          )
                      ),
                      -- VALOR VENTILADO Y QUEMADO
                      (
                          (
                              0.25 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                          )
                      ) +(
                          0.5 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                      )
                  ),
                  --SOLO VENTILADO
                  IIF(
                      HC.HCCM09N63 = 'SI',
                      (
                          (
                              0.20 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                          ) +(
                              0.5 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                          )
                      ),
                      --SOLO QUEMADO
                      (
                          0.5 *((DATEPART(HOUR, GETDATE())) - 7) * TEMP.HCRPESO
                      )
                  )
              ),
              -- NORMAL
              0
          ),
          --NO ES EL MISMO DIA
          IIF(
              HC.HCCM09N61 = 'SI',
              --¿ UCI ?
              IIF(
                  HC.HCCM09N62 = 'SI',
                  -- ¿ ESTA VENTILADO ?
                  IIF(
                      HC.HCCM09N63 = 'SI',
                      -- ¿ ESTA QUEMADO ?
                      (
                          (0.20 * 24 * TEMP.HCRPESO) +(0.25 * 24 * TEMP.HCRPESO) +(0.5 * 24 * TEMP.HCRPESO)
                      ),
                      -- VALOR VENTILADO Y QUEMADO
                      (0.25 * 24 * TEMP.HCRPESO) +(0.5 * 24 * TEMP.HCRPESO)
                  ),
                  --SOLO VENTILADO
                  IIF(
                      HC.HCCM09N63 = 'SI',
                      (0.20 * 24 * TEMP.HCRPESO) +(0.5 * 24 * TEMP.HCRPESO),
                      --SOLO QUEMADO
                      (0.5 * 24 * TEMP.HCRPESO)
                  )
              ),
              -- NORMAL
              0.5 * 24 * TEMP.HCRPESO
          )
      ) AS PERDIDA,
      HC.HCCM09N61 UCI,
      HC.HCCM09N62 VENTILADO,
      HCCM09N63 QUEMADO,
      TEMP.HCSVALOR TEMPERATURA,
      TEMP.HCFECREG,
      I.AINCONSEC,
      HP.HESFECING,
      TEMP.HCRHORREG,
      TEMP.HCRPESO,
      FORMAT(HF.HCFECFOL, 'yyyy-MM-dd') FECHA
  FROM
      HCMEVOHOS HC
      INNER JOIN HCNFOLIO HF ON HF.OID = HC.HCNFOLIO
      INNER JOIN ADNINGRESO I ON I.OID = HF.ADNINGRESO
      INNER JOIN HPNESTANC HP ON HP.ADNINGRES = I.OID
      INNER JOIN (
          SELECT
              HD.hora,
              H.OID,
              H.ADNINGRESO,
              A.AINCONSEC,
              H.HCFECREG,
              H.HCRPESO,
              HC.HCRHORREG,
              HC.HCSVALOR,
              HCN.HCSNOMBRE
          FROM
              HCNREGENF H
              Inner Join HCNSIGVIT HC On H.OID = HC.HCNREGENF
              Inner Join HCNTIPSVIT HCN On HCN.OID = HC.HCNTIPSVIT
              Inner Join ADNINGRESO A On A.OID = H.ADNINGRESO
              INNER JOIN HORAS_DIA HD ON HD.hora = DATEPART(HOUR, HC.HCRHORREG)
          WHERE
              A.AINCONSEC = @0
              AND H.HCFECREG = @1
              AND HCN.HCSNOMBRE = 'TEMPERATURA'
      ) AS TEMP ON TEMP.AINCONSEC = I.AINCONSEC
  ORDER BY
      FECHA DESC;`,
      [dto.ingreso, dto.fecha]
    );
    if (result.length > 0) {
      return result[0].PERDIDA;
    } else {
      return 0;
    }
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
