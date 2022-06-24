import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import { CentroAtencionRepository } from "./repositories/centro-atencion.repository";

@Injectable()
export class CentroAtencionService extends BaseService {
  async findAll() {
    try {
      const centros = await CentroAtencionRepository(this.context).find();
      if (centros[0]) {
        return this.successRes({ centros });
      } else {
        return this.badSuccessRes("No se encontró ningún centro de atención");
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
  /** Devuelve el centro de atención por medio del id (si existe). */
  async findOne(id: number) {
    try {
      const centro = await CentroAtencionRepository(this.context).findOne({
        where: [{ ID: id }],
      });
      if (centro) {
        return this.successRes({ centro });
      } else {
        return this.badSuccessRes("No se encontró ningún centro de atención");
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
