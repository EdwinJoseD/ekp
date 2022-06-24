import * as cn from "src/application/services/connection.service";
import {
  SignosVitalesAbreviadosI,
  SignosVitalesAgrupadosI,
  SignosVitalesI,
} from "../interfaces/signos-vitales.interface";
import { GetSabanasUCiDto } from "../dtos/get-sabanas-uci.dto";

export const getSignosVitales = async (
  dto: GetSabanasUCiDto,
  context: string
): Promise<SignosVitalesAgrupadosI[]> => {
  try {
    const result: SignosVitalesI[] = await cn.getDataSource(context).query(
      `Select
      HORAS_DIA.hora,
      --HORAS_DIA.oid,
      --CONSOLIDADO.HORAREG,
      CONSOLIDADO.signo,
      CONSOLIDADO.valor,
      IsNull(CONSOLIDADO.CATEGORIA, 'SIN REGISTRO') As categoria,
      IsNull(CONSOLIDADO.SUBGRUPO, 'VACIO') As subgrupo
  From
      HORAS_DIA
      Left Join (
          Select
              DatePart(HOUR, HCNSIGVIT.HCRHORREG) HORAREG,
              HCNTIPSVIT.HCSDESCRI SIGNO,
              HCNSIGVIT.HCSVALOR VALOR,
              0 As PESO,
              'LIQUIDOS' CATEGORIA,
              'LIQUIDOS ADMINISTRADOS' SUBGRUPO,
              HCNREGENF.HCFECREG FECHA_REGISTRO_ENF
          From
              HCNREGENF
              Inner Join HCNSIGVIT On HCNREGENF.OID = HCNSIGVIT.HCNREGENF
              Inner Join HCNTIPSVIT On HCNTIPSVIT.OID = HCNSIGVIT.HCNTIPSVIT
              Inner Join ADNINGRESO On ADNINGRESO.OID = HCNREGENF.ADNINGRESO
          Where
              HCNREGENF.HCFECREG = @1
              And ADNINGRESO.AINCONSEC = @0
      ) As CONSOLIDADO On CONSOLIDADO.HORAREG = HORAS_DIA.hora
  Where
      CONSOLIDADO.HORAREG Is Not Null
  order by
      oid`,
      [dto.ingreso, dto.fecha]
    );
    //Agrupando los resultados por signo
    let SVAgrupados: SignosVitalesAgrupadosI[] = [];
    result.map((r: SignosVitalesI) => {
      if (SVAgrupados.filter((i: SignosVitalesAgrupadosI) => i.signo === r.signo).length === 0) {
        const newAgrup: SignosVitalesAgrupadosI = {
          signo: r.signo,
          categoria: r.categoria,
          subgrupo: r.subgrupo,
          resultados: [{ hora: r.hora, valor: r.valor }],
        };
        SVAgrupados.push(newAgrup);
      } else {
        SVAgrupados.filter((i: SignosVitalesAgrupadosI) => i.signo === r.signo)[0].resultados.push({
          hora: r.hora,
          valor: r.valor,
        });
      }
    });
    //Autocompletando horas faltantes
    SVAgrupados.map((r: SignosVitalesAgrupadosI) => {
      let SVAutocompletado: SignosVitalesAbreviadosI[] = [];
      for (let i = 7; i <= 23; i++) {
        const signo = r.resultados.filter((element: SignosVitalesAbreviadosI) => element.hora === i)[0];
        if (signo !== undefined) {
          SVAutocompletado.push(signo);
        } else {
          SVAutocompletado.push({ hora: i, valor: "0" });
        }
      }
      for (let i = 0; i <= 6; i++) {
        const signo = r.resultados.filter((element: SignosVitalesAbreviadosI) => element.hora === i)[0];
        if (signo !== undefined) {
          SVAutocompletado.push(signo);
        } else {
          SVAutocompletado.push({ hora: i, valor: "0" });
        }
      }
      r.resultados = SVAutocompletado;
    });
    return SVAgrupados;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
