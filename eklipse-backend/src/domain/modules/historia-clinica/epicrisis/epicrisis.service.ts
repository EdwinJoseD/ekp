import { Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import * as queries from "./queries";
import { EpicrisisDto } from "./dtos/epicrisis.dto";

@Injectable()
export class EpicrisisService extends BaseService {
  async getEpicrisis(dto: EpicrisisDto) {
    const result = await queries.getEpicrisis(dto, this.context);
    if (result[0]) {
      const epicrisis = result[0];
      return this.successRes({ epicrisis });
    } else {
      return this.badSuccessRes("No se encontró epicrisis para desconfirmar");
    }
  }
  async desconfirmarEpicrisis(dto: EpicrisisDto) {
    await queries.desconfirmarEpicrisis(dto, this.context);
    return this.successRes([], "Epicrisis desconfirmada correctamente");
  }
}
