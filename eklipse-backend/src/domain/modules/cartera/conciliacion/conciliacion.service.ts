import { BadRequestException, Injectable } from "@nestjs/common";
import { ConciliacionCarteraDto } from "./dto/conciliacion.dto";
import { ConciliacionRepository } from "./repository/conciliacion.repository";
import * as path from "path";
import { BaseService } from "src/application/services/base.service";

@Injectable()
export class ConciliacionService extends BaseService {
  async getConciliaciones() {
    try {
      const data = await ConciliacionRepository(this.context).getConciliaciones();
      if (data) {
        return {
          success: true,
          message: "Lista de Conciliaciones Pendientes",
          data,
        };
      } else {
        return { success: false, message: "No hay Conciliaciones Pendientes" };
      }
    } catch (error) {
      throw new BadRequestException("Ocurrio un Error al Obtener las Conciliaciones");
    }
  }
  async updateConciliacion(id: number, conciliacion: ConciliacionCarteraDto) {
    return ConciliacionRepository(this.context).updateConciliacion(id, conciliacion);
  }
  async updateActa(OID: number, namefile: string) {
    return ConciliacionRepository(this.context).updateActa(OID, namefile);
  }
  async deleteConciliacion(id: number) {
    return ConciliacionRepository(this.context).deleteConciliacion(id);
  }
  async getActa(OID: number) {
    try {
      const ruta = await ConciliacionRepository(this.context).getActa(OID);
      if (ruta) {
        const file = path.join(__dirname, "../../../", ruta[0].Ruta);
        return file;
      }
      return "";
    } catch (error) {
      throw new BadRequestException("Ocurrio un Error al Obtener el Acta");
    }
  }
}
