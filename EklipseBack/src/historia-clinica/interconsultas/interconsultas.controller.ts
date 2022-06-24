import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { InterconsultasService } from './interconsultas.service';

@Auth()
@ApiTags('Interconsultas Pendientes')
@Controller('interconsultas')
export class InterconsultasController {
  constructor(private readonly interconsultasService: InterconsultasService) {}

  @Get()
  getEspecialidad() {
    return this.interconsultasService.getInterconsultas();
  }

  @Get('/:id')
  getPacientes(@Param('id') id: number) {
    return this.interconsultasService.getPacientes(id);
  }
}
