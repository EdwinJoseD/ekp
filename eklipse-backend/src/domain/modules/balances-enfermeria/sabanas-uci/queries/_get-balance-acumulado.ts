import * as cn from "src/application/services/connection.service";
import { BalancesI } from "../interfaces/balances.interface";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getBalanceAcumulado = async (
  dto: GetSabanasUCiDto,
  context: string
): Promise<BalancesI> => {
  try {
    const diaEnMS = 86400000; //24 * 60 * 60 * 1000
    const diaSelec = new Date(dto.fecha);
    const diaAnteToSelec = new Date(diaSelec.getTime() - diaEnMS);
    const diaSelecFormat = diaSelec.toISOString().split("T")[0];
    const diaAnteToSelecFormat = diaAnteToSelec.toISOString().split("T")[0];
    const balanceActual = await getBalance24H(diaSelecFormat, dto.ingreso, context);
    const balanceAnterior = await getBalance24H(diaAnteToSelecFormat, dto.ingreso, context);
    const balanceAcumulado = balanceActual[0].Balance + balanceAnterior[0].Balance;
    return { B24H: balanceActual[0].Balance, BAcu: balanceAcumulado };
  } catch (error) {
    cn.ThrBadReqExc();
  }
};

const getBalance24H = async (fecha: string, ingreso: string, context: string) => {
  try {
    const result = await cn.getDataSource(context).query(
      `Select
      SUM(CONSOLIDADO.CANTIDAD) Balance
  From
      HORAS_DIA -- TABLA CON LAS HORAS DEL DÍA
      Left Join (
          Select
              DatePart(HOUR, HCNLIQELM.HCRHORREG) HORAREG,
              HCNTIPLQEL.HCLNOMBRE LIQUIDO,
              HCNLIQELM.HCLCANTID * -1 CANTIDAD,
              HCNLIQELM.HCLPESO PESO,
              'LIQUIDOS' CATEGORIA,
              'LIQUIDOS ELIMINADOS' SUBGRUPO,
              HCNREGENF.HCFECREG FECHA_REGISTRO_ENF
          From
              HCNREGENF
              Inner Join HCNLIQELM On HCNREGENF.OID = HCNLIQELM.HCNREGENF
              Inner Join ADNINGRESO On ADNINGRESO.OID = HCNREGENF.ADNINGRESO
              Inner Join HCNTIPLQEL On HCNTIPLQEL.OID = HCNLIQELM.HCNTIPLQEL
          Where
              HCNREGENF.HCFECREG = @0
              And ADNINGRESO.AINCONSEC = @1
          Union
          Select
              DatePart(HOUR, HCNLIQADM.HCRHORREG) HORAREG,
              HCNLIQADM.HCLLIQNOM LIQUIDO,
              HCNLIQADM.HCLCANTID CANTIDAD,
              0 As PESO,
              'LIQUIDOS' CATEGORIA,
              'LIQUIDOS ADMINISTRADOS' SUBGRUPO,
              HCNREGENF.HCFECREG FECHA_REGISTRO_ENF
          From
              HCNREGENF
              Inner Join HCNLIQADM On HCNREGENF.OID = HCNLIQADM.HCNREGENF
              Inner Join ADNINGRESO On ADNINGRESO.OID = HCNREGENF.ADNINGRESO
          Where
              HCNREGENF.HCFECREG = @0
              And ADNINGRESO.AINCONSEC = @1
      ) As CONSOLIDADO On CONSOLIDADO.HORAREG = HORAS_DIA.hora`,
      [fecha, ingreso]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
