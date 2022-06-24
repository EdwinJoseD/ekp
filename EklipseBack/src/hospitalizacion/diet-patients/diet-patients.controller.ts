import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { DietPatientsService } from './diet-patients.service';
import { DietaDto } from './dtos';

@ApiTags('Dietas')
@Controller('diet-patients')
export class DietPatientsController {
  constructor(private readonly dietPatientsService: DietPatientsService) {}

  @Auth()
  @ApiOperation({
    description:
      'Este End Point retorna los pacientes a los que se le va a registrar una dieta.',
  })
  @Get()
  async getPatientsForDiets(
    @Query('center') center: number,
    @Query('subgroup') subgroup: string
  ) {
    const patients = await this.dietPatientsService.getPatientsForDiets(
      center,
      subgroup
    );
    return patients;
  }

  @Auth()
  @ApiOperation({
    description:
      'Este End Point recibe el objeto con los pacientes para registrar la dieta.',
  })
  @Post()
  async registerDieta(@Body() dietaDto: DietaDto) {
    const registro = await this.dietPatientsService.RegistroFinal(dietaDto);
    return registro;
  }

  @Auth()
  @ApiOperation({
    description:
      'Este End Point Retorna las jornadas registradas en una fecha.',
  })
  @Get('jornada')
  async getJornadaDietas(@Query('Fecha') fechaDieta?: Date) {
    if (fechaDieta == null) {
      const fecha = new Date();
      return await this.dietPatientsService.getDietaJornada(fecha);
    } else {
      const res = await this.dietPatientsService.getDietaJornada(fechaDieta);
      return res;
    }
  }

  @Auth()
  @ApiOperation({
    description: 'Este End Point Retorna las dietas registradas en una fecha.',
  })
  @Get('estado')
  async getEstadoDietas(@Query('jornada') jornada: number) {
    const pacientes = await this.dietPatientsService.getDietaEstado(jornada);
    return pacientes;
  }

  @Auth()
  @Delete()
  async delete_Dieta_Jornada_Subgrupo(
    @Query('jornada') jornada,
    @Query('subgrupo') subgrupo,
    @Req() req: Request
    //@Param('subgrupo', ParseIntPipe) subgrupo
  ) {
    console.log(req.params);
    return { message: 'algo' };
  }

  @Auth()
  @Get('confirmacion')
  async confirmacion(@Query('jornada') jornada: number) {
    return this.dietPatientsService.confirmacionEntrega(jornada);
  }

  @Auth()
  @Get('facturacionGeneral')
  async facturasGeneral(
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFinal') fechaFinal: Date
  ) {
    return await this.dietPatientsService.facturacionGeneral(
      fechaInicio.toISOString().split('T')[0],
      fechaFinal.toISOString().split('T')[0]
    );
  }

  @Auth()
  @Get('facturacion')
  async facturacion(
    @Query('fecha') fecha: Date,
    @Query('adncenate') centro: string
  ) {
    return await this.dietPatientsService.facturacionPorCentro(
      fecha.toISOString().split('T')[0],
      centro
    );
  }
}
