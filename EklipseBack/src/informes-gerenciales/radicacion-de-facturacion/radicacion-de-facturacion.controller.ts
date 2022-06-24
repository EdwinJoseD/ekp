import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { RadicacionDeFacturacionService } from './radicacion-de-facturacion.service';

@Auth()
@ApiTags('Radicacion Por Facturacion')
@Controller('radicacion-de-facturacion')
export class RadicacionDeFacturacionController {
  constructor(
    private readonly radicacionServices: RadicacionDeFacturacionService
  ) {}

  @Get()
  async fullData(
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechaF = fechaFin.toISOString().split('T')[0];
    return await this.radicacionServices.fullData(
      fechaini,
      fechaF,
      centro1,
      centro2
    );
  }

  @Get('contrato')
  async contrato(
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('contrato') contrato: number
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechaF = fechaFin.toISOString().split('T')[0];
    return await this.radicacionServices.radicacionPorEntidadesPorContrato(
      fechaini,
      fechaF,
      contrato
    );
  }

  @Get('pendientes/:fechaInicio/:fechaFin')
  async radicacionPendiente(
    @Param('fechaInicio') fechaInicio: Date,
    @Param('fechaFin') fechaFin: Date
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechaF = fechaFin.toISOString().split('T')[0];
    return await this.radicacionServices.radicacionPendienteMesesAnteriores(
      fechaini,
      fechaF
    );
  }

  @Get('facturas-pendientes')
  async facturasPendientes() {
    return await this.radicacionServices.facturasSinRadicar();
  }
}
