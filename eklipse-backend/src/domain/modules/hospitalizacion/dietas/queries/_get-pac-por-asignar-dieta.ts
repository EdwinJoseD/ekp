import * as cn from "src/application/services/connection.service";
import { GetPacPorAsignarDietaDto } from "../dtos/get-pac-asig-die.dto";

export const getPacientesPorAsignarDieta = async (dto: GetPacPorAsignarDietaDto, context: string) => {
  try {
    const result = await cn.getDataSource(context).query(
      `SELECT
      C.HCACODIGO AS CODIGOCAMA,
      G.HPNESTANC,
      C.GPANOMPAC NOMBREPAC,
      G.HCSFECFOL,
      G.HCSDIETIP AS DIEGRUTIP,
      G.HCSDIENOM,
      G.HCSDIECON AS DIEGRUCON,
      G.HCSDIEOBS AS DIEGRUOBS,
      G.GEEDESCRI,
      G.GMENOMCOM
  FROM
      GCVHOSDIEEVO G
      RIGHT JOIN GCVHOSCENPAC C ON C.HPNESTANC = G.HPNESTANC
  WHERE
      C.HESFECSAL IS NULL
      AND C.HCAESTADO < 3
      AND C.ADNCENATE = @0
      AND C.HSUCODIGO = @1;`,
      [dto.centroAtencion, dto.subgrupo]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
