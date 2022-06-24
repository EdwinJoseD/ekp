import { Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import * as queries from "./queries";
import { GetCensoGrupocamasDto } from "./dtos/get-censo-grupo-camas.dto";
import { GetSubgruposCamasDto } from "./dtos/get-subgs-camas.dto";

@Injectable()
export class CamasService extends BaseService {
  async getCamas() {
    const camas = await queries.getCamas(this.context);
    return this.successRes({ camas });
  }
  async getCensoCamas() {
    const censoCamas = await queries.getCensoCamas(this.context);
    return this.successRes({ censoCamas });
  }
  async getCensoGrupoCamas(dto: GetCensoGrupocamasDto) {
    const grupoCamas = await queries.getCensoGrupoCamas(dto, this.context);
    return this.successRes({ grupoCamas });
  }
  async getSubgruposCamas(dto: GetSubgruposCamasDto) {
    const subgrupos = await queries.getSubgruposCamas(dto, this.context);
    if (subgrupos[0]) {
      return this.successRes({ subgrupos });
    } else {
      return this.badSuccessRes("El centro de atención no tiene subgrupo de camas");
    }
  }
}
