import * as cn from "src/application/services/connection.service";
import {
  LiquidosAbreviadosI,
  LiquidosAgrupadosI,
  LiquidosI,
} from "src/domain/modules/balances-enfermeria/sabanas-uci/interfaces/liquidos.interface";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getLiquidos = async (
  dto: GetSabanasUCiDto,
  context: string
): Promise<LiquidosAgrupadosI[]> => {
  try {
    const result = await cn.getDataSource(context).query(
      `Select
      --CONSOLIDADO.HORAREG,	-- HORA DEL REGISTRO DEL LIQUIDO
      --HORAS_DIA.oid id,
      HORAS_DIA.hora,
      CONSOLIDADO.liquido,
      CONSOLIDADO.cantidad,
      IsNull(CONSOLIDADO.CATEGORIA, '') As categoria,
      IsNull(CONSOLIDADO.SUBGRUPO, '') As subgrupo
  From
      HORAS_DIA
      Left Join (
          Select
              DatePart(HOUR, HCNLIQELM.HCRHORREG) HORAREG,
              HCNTIPLQEL.HCLNOMBRE LIQUIDO,
              HCNLIQELM.HCLCANTID CANTIDAD,
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
              HCNREGENF.HCFECREG = @1
              And ADNINGRESO.AINCONSEC = @0
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
              HCNREGENF.HCFECREG = @1
              And ADNINGRESO.AINCONSEC = @0
      ) As CONSOLIDADO On CONSOLIDADO.HORAREG = HORAS_DIA.hora
  ORDER BY
      CONSOLIDADO.subgrupo,
      oid;`,
      [dto.ingreso, dto.fecha]
    );
    //Agrupando los resultados por liquido
    let LAgrupados: LiquidosAgrupadosI[] = [];
    result.map((r: LiquidosI) => {
      if (r.liquido !== null) {
        if (LAgrupados.filter((i: any) => i.liquido === r.liquido).length === 0) {
          const newAgrup: any = {
            liquido: r.liquido,
            categoria: r.categoria,
            subgrupo: r.subgrupo,
            resultados: [{ hora: r.hora, cantidad: r.cantidad }],
          };
          LAgrupados.push(newAgrup);
        } else {
          LAgrupados.filter((i: any) => i.liquido === r.liquido)[0].resultados.push({
            hora: r.hora,
            cantidad: r.cantidad,
          });
        }
      }
    });
    //Autocompletando horas faltantes
    LAgrupados.map((r: LiquidosAgrupadosI) => {
      let LAutocompletado: LiquidosAbreviadosI[] = [];
      for (let i = 7; i <= 23; i++) {
        const liquido = r.resultados.filter((element: LiquidosAbreviadosI) => element.hora === i)[0];
        if (liquido !== undefined) {
          LAutocompletado.push(liquido);
        } else {
          LAutocompletado.push({ hora: i, cantidad: 0 });
        }
      }
      for (let i = 0; i <= 6; i++) {
        const liquido = r.resultados.filter((element: LiquidosAbreviadosI) => element.hora === i)[0];
        if (liquido !== undefined) {
          LAutocompletado.push(liquido);
        } else {
          LAutocompletado.push({ hora: i, cantidad: 0 });
        }
      }
      r.resultados = LAutocompletado;
    });
    return LAgrupados;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
