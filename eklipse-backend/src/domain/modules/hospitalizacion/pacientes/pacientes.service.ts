import { Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import * as queries from "./queries";

@Injectable()
export class PacientesService extends BaseService {
  async getPendientes() {
    const pacientes = await queries.getPacientes(this.context);
    return this.successRes({ pacientes });
  }
}
