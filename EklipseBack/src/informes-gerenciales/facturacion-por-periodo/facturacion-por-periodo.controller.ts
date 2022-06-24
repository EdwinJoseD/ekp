import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { FacturacionPorPeriodoService } from './facturacion-por-periodo.service';

@ApiTags('Facturacion por periodo')
@Auth()
@Controller('facturacion')
export class FacturacionPorPeriodoController {
  constructor(private readonly service: FacturacionPorPeriodoService) {}

  @Get(':fechaInicio/:fechaFin/:centro1/:centro2')
  async getFacturacionResumen(
    @Param('fechaInicio') fechaInicio: string,
    @Param('fechaFin') fechaFin: string,
    @Param('centro1') centro1: string,
    @Param('centro2') centro2: string
  ) {
    return await this.service.getFacturacionResumen(
      fechaInicio,
      fechaFin,
      Number(centro1),
      Number(centro2)
    );
  }

  @Get('datas/:fechaInicio/:fechaFin')
  async getFullData(
    @Param('fechaInicio') fechaInicio: string,
    @Param('fechaFin') fechaFin: string
  ) {
    return await this.service.getFullData(fechaInicio, fechaFin);
  }

  @Get('contratos')
  async getContratosPorEntidad(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('entidad') entidad: string
  ) {
    return await this.service.getContratosPorEntidad(
      fechaInicio,
      fechaFin,
      entidad
    );
  }

  @Get('usuario')
  async getFacturacionUsuario(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('usuario') usuario: string
  ) {
    return await this.service.getFacturacionPorUsuario(
      fechaInicio,
      fechaFin,
      usuario
    );
  }
}
