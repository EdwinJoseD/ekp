import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { PgpService } from './pgp.service';

@ApiTags('Estadistico PGP')
@Auth()
@Controller('pgp')
export class PgpController {
  constructor(private readonly pgpService: PgpService) {}

  @Get('consumido-facturado')
  async consumidoPgpFacturado(
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    try {
      const fechaini = fechaInicio.toISOString().split('T')[0];
      const fechafin = fechaFin.toISOString().split('T')[0];
      return await this.pgpService.consumidoPgpFacturado(
        fechaini,
        fechafin,
        centro1,
        centro2
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  /**
   *
   * @returns consumido actual del censo
   */
  @Get('consumido-acostado')
  async consumidoPgpAcostado(
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    return await this.pgpService.consumidoPgpAcostadoActual(centro1, centro2);
  }

  /**
   *
   * @returns consumido actual del censo
   */
  @Get('consumido-acostado-antiguo')
  async consumidoPgpAcostadoAntiguo(
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    return await this.pgpService.consumidoPgpAcostadoAntiguo(centro1, centro2);
  }

  @Get('largas-estancia')
  async largasEstancia(
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('contrato1') contrato1: number,
    @Query('contrato2') contrato2: number
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechafin = fechaFin.toISOString().split('T')[0];
    return await this.pgpService.getLargasEstancia(
      fechaini,
      fechafin,
      contrato1,
      contrato2
    );
  }

  @Get('agrupadores')
  async PgpAgrupadoresFinales(
    @Query('contrato1') contrato1: string,
    @Query('contrato2') contrato2: string,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    try {
      const fechaini = fechaInicio.toISOString().split('T')[0];
      const fechafin = fechaFin.toISOString().split('T')[0];
      return await this.pgpService.PgpAgrupadoresFinales(
        contrato1,
        contrato2,
        fechaini,
        fechafin,
        centro1,
        centro2
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  @Get('historial-agrupadores')
  async getHistorialAgrupadores(
    @Query('contrato') contrato: string,
    @Query('ingreso') ingreso: string,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date
  ) {
    try {
      const fechaini = fechaInicio.toISOString().split('T')[0];
      const fechafin = fechaFin.toISOString().split('T')[0];
      return await this.pgpService.getHistorialAgrupadores(
        contrato,
        ingreso,
        fechaini,
        fechafin
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  @Get('pacientes-agrupador')
  async PgpPacientesAgrupador(
    @Query('agrupador') agrupador: string,
    @Query('contrato1') contrato1: string,
    @Query('contrato2') contrato2: string,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechafin = fechaFin.toISOString().split('T')[0];
    return await this.pgpService.getPacientesAgrupador(
      agrupador,
      contrato1,
      contrato2,
      fechaini,
      fechafin,
      centro1,
      centro2
    );
  }

  @Get('servicios-pacientes')
  async PgpServiciosPacientes(
    @Query('ingreso') ingreso: number,
    @Query('contrato') contrato: string,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechafin = fechaFin.toISOString().split('T')[0];
    return await this.pgpService.getServiciosPaciente(
      ingreso,
      contrato,
      fechaini,
      fechafin
    );
  }

  /**
   *
   * @param contrato contrato para traer los pacientes
   * @returns Devuelve el censo actual
   */
  @Get('pacientesAcostados')
  async getPacientesAcostados(
    @Query('contrato') contrato: string,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    return await this.pgpService.getPacientesAcostadosActual(
      contrato,
      centro1,
      centro2
    );
  }

  /**
   *
   * @param contrato contrato para traer los pacientes
   * @returns Devuelve el censo actual
   */
  @Get('pacientesAcostadosAntiguo')
  async getPacientesAcostadosAntiguo(
    @Query('contrato') contrato: string,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    return await this.pgpService.getPacientesAcostadosAntiguo(
      contrato,
      centro1,
      centro2
    );
  }

  @Get('AgrupadorespacientesAcostados')
  async getAgruapdoresPacientesAcostados(
    @Query('contrato') contrato: string,
    @Query('ingreso') ingreso: string
  ) {
    return await this.pgpService.getAgrupadoresPacientesAcostados(
      contrato,
      ingreso
    );
  }

  @Get('ServiciospacientesAcostados')
  async getServiciosPacientesAcostados(
    @Query('contrato') contrato: string,
    @Query('ingreso') ingreso: string
  ) {
    return await this.pgpService.getServiciosPacientesAcostados(
      contrato,
      ingreso
    );
  }

  @Get('consumidodiario')
  async totalEjecutadoDiario(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('contrato') contrato: string
  ) {
    return await this.pgpService.totalEjecutadoDiario(
      fechaInicio,
      fechaFin,
      contrato
    );
  }

  @Get('consumidodiarioacostado')
  async totalEjecutadoDiarioAcos() {
    return await this.pgpService.totalEjecutadoAcostado();
  }

  @Get('consumidodiarioAsmet')
  async totalEjecutadoDiarioAsmet(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('contrato') contrato: string
  ) {
    return await this.pgpService.totalEjecutadoDiarioAsmet(
      fechaInicio,
      fechaFin,
      contrato
    );
  }

  @Get('consolidado-contrato')
  async ConsolidadoContrato(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return await this.pgpService.getConsolidadoContratos(fechaInicio, fechaFin);
  }

  @Get('consolidado-pacientes')
  async ConsolidadoPacientes(
    @Query('contrato') contrato: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return await this.pgpService.getConsolidadoPacientes(
      contrato,
      fechaInicio,
      fechaFin
    );
  }

  @Get('agrupadores-consolidado')
  async PgpAgrupadoresConsolidado(
    @Query('contrato1') contrato1: string,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechafin = fechaFin.toISOString().split('T')[0];
    return await this.pgpService.getAgrupadoresConsolidado(
      contrato1,
      fechaini,
      fechafin
    );
  }

  @Get('diferencia-consolidado')
  async PgpDiferenciaConsolidado(
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Query('centro1') centro1: number,
    @Query('centro2') centro2: number
  ) {
    const fechaini = fechaInicio.toISOString().split('T')[0];
    const fechafin = fechaFin.toISOString().split('T')[0];
    return await this.pgpService.getConsolidadoDiferencia(fechaini, fechafin);
  }
}
