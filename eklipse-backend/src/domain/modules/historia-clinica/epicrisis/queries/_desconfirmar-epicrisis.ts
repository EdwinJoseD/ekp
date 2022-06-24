import * as cn from "src/application/services/connection.service";
import { EpicrisisDto } from "../dtos/epicrisis.dto";

export const desconfirmarEpicrisis = async (dto: EpicrisisDto, context: string): Promise<void> => {
  try {
    const result = await cn.getDataSource(context).query(
      `UPDATE
      HCNEPICRI
  SET
      HCEESTDOC = 0
  WHERE
      HCECONSEC = @0`,
      [dto.consecutivo]
    );
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
