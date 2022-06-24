import { BaseService } from "src/application/services/base.service";
import { Injectable } from "@nestjs/common";
import * as queries from "./queries";
import { UpdateMedicamentosDto } from "./dtos/update-medicamentos.dto";
import { GetMedicamentosDto } from "./dtos/get-medicamentos.dto";

@Injectable()
export class ConceptosAdmisionService extends BaseService {
  async getMedicamentos(dto: GetMedicamentosDto) {
    let medicamentos = null;
    if (dto.conceptoFacturacion === "all") {
      medicamentos = await queries.getAllMedicamentos(dto, this.context);
    } else {
      medicamentos = await queries.getMedByConcepto(dto, this.context);
    }
    if (medicamentos[0]) {
      return this.successRes({ medicamentos });
    } else {
      const msg = "No se encontraron resultados con los filtros establecidos en formulario";
      return this.badSuccessRes(msg);
    }
  }
  async updateMedicamentos(dto: UpdateMedicamentosDto) {
    if (dto.conceptoFacturacion === 12 || dto.conceptoFacturacion === 13) {
      const result = await queries.updateMedicamentos(dto, this.context);
      if (result) {
        return this.successRes([], "Medicamentos actualizados correctamente");
      } else {
        return this.badSuccessRes("Ocurrió un error al actualizar el medicamento(s)");
      }
    } else {
      return this.badSuccessRes("El concepto de facturación no es valido");
    }
  }
}
