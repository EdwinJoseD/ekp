import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "src/application/decorators/auth.decorator";
import { GestionCarteraDto } from "./dto/gestion.dto";
import { GestionService } from "./gestion.service";

@Auth()
@ApiTags("cartera/gestion")
@Controller("gestion")
export class GestionController {
  constructor(private readonly service: GestionService) {}

  @Get()
  async getGestions() {
    return await this.service.getGestions();
  }

  @Get("/tercero/:nit")
  async getTercero(@Param("nit") nit: string) {
    return await this.service.getTercero(nit);
  }

  @Post()
  async addGestion(@Body() gestionDto: GestionCarteraDto) {
    return await this.service.addGestion(gestionDto);
  }

  @Put(":oid")
  async updateGestion(@Param("oid") oid: number, @Body() gestionDto: GestionCarteraDto) {
    return await this.service.updateGestion(oid, gestionDto);
  }

  @Delete("/:id")
  async deleteGestion(@Param("id") id: number) {
    return await this.service.deleteGestion(id);
  }
}
