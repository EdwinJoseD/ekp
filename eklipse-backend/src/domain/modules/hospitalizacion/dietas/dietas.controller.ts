import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { DietasService } from "./dietas.service";
import { Auth } from "src/application/decorators/auth.decorator";
import { CreateJornadaDietaDto } from "./dtos/create-jornada-dieta.dto";
import { GetPacPorAsignarDietaDto } from "./dtos/get-pac-asig-die.dto";
import { GetDietaJornadaDto } from "./dtos/get-dieta-jornada.dto";
import { GetDietaEstadoDto } from "./dtos/get-dieta-estado.dto";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("hospitalizacion/dietas")
@Controller("dietas")
export class DietasController {
  constructor(private readonly dietasService: DietasService) {}

  @Get("jornadas/:fecha")
  getJornadasDieta(@Param() dto: GetDietaJornadaDto) {
    return this.dietasService.getJornadasDieta(dto);
  }

  @Post("jornadas")
  createJornadaDieta(@Body() body: CreateJornadaDietaDto) {
    return this.dietasService.createJornadaDieta(body);
  }

  @Get("estado/:jornadaDieta")
  getEstadoDieta(@Param() dto: GetDietaEstadoDto) {
    return this.dietasService.getEstadoDieta(dto);
  }

  @Get("pacientes/:centroAtencion/:subgrupo")
  getPacPorAsignarDieta(@Param() dto: GetPacPorAsignarDietaDto) {
    return this.dietasService.getPacPorAsignarDieta(dto);
  }
}
