import { Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import * as queries from "./queries";

@Injectable()
export class InterconsultasService extends BaseService {
  async getInterconsultasPendientes() {
    const interconsultas = await queries.getInterconsultasPendientes(this.context);
    return this.successRes({ interconsultas });
  }
}
