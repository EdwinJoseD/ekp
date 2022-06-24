import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { UciSheetsService } from './uci-sheets.service';

@Auth()
@ApiTags('Sabanas')
@Controller('uci-sheets')
export class UciSheetsController {
  constructor(private readonly uciSheetsService: UciSheetsService) {}

  @Get()
  async getUciSheets(
    @Query('Ingreso') adnIngreso: string,
    @Query('Fecha') fecha: Date
  ) {
    return await this.uciSheetsService.getUciSheets(adnIngreso, fecha);
  }

  @Get('Estancia')
  async getHpnestancia(@Query('Ingreso') adnIngreso: string) {
    return await this.uciSheetsService.getHpnestancia(adnIngreso);
  }

  @Get('/datas')
  async getUciSheet(
    @Query('Ingreso') adnIngreso: string,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFinal') fechaFinal: Date
  ) {
    return await this.uciSheetsService.getUciSheet(
      adnIngreso,
      fechaInicio,
      fechaFinal
    );
  }

  @Get('pacientes')
  async pacientesSinPeso() {
    return await this.uciSheetsService.PacientesSinPeso();
  }
}
