import { Controller, Get, Param, Body, Put } from "@nestjs/common";
import { ConceptosAdmisionService } from "./conceptos-admision.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { UpdateMedicamentosDto } from "./dtos/update-medicamentos.dto";
import { GetMedicamentosDto } from "./dtos/get-medicamentos.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("facturacion/conceptos-admision")
@Controller("conceptos-admision")
export class ConceptosAdmisionController {
  constructor(private readonly conceptosAdmisionService: ConceptosAdmisionService) {}

  @Get("medicamentos/:ingreso/:conceptoFacturacion")
  getMedicamentos(@Param() dto: GetMedicamentosDto) {
    return this.conceptosAdmisionService.getMedicamentos(dto);
  }

  @Put("medicamentos")
  @ApiBody({ type: UpdateMedicamentosDto })
  async update(@Body() body: UpdateMedicamentosDto) {
    return await this.conceptosAdmisionService.updateMedicamentos(body);
  }
}
