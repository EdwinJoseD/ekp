import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "src/application/services/base.service";
import { GestionCarteraDto } from "./dto/gestion.dto";
import { GestionRepository } from "./repository/gestion.repository";

@Injectable()
export class GestionService extends BaseService {
  async getGestions() {
    try {
      const data = await GestionRepository(this.context).getGestions();
      if (data) {
        return { success: true, message: "Gestiones", data };
      } else {
        return { success: false, message: "No hay gestiones" };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getTercero(nit: string) {
    try {
      const data = await GestionRepository(this.context).getTercero(nit);
      if (data) {
        return { success: true, message: "Tercero", data };
      } else {
        return { success: false, message: "Tercero no encontrado", data: [] };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async addGestion(gestion: GestionCarteraDto) {
    return await GestionRepository(this.context).addGestion(gestion);
  }
  async deleteGestion(id: number) {
    return await GestionRepository(this.context).deleteGestion(id);
  }
  async updateGestion(id: number, gestion: GestionCarteraDto) {
    return await GestionRepository(this.context).updateGestion(id, gestion);
  }
}
