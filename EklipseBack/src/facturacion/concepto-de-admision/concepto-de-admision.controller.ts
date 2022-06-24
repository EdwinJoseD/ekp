import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { ConceptoDeAdmisionService } from './concepto-de-admision.service';
import { IMedicamentos } from './interface';

@ApiTags('Concepto de Admision')
@Auth()
@Controller('concepto-admision')
export class ConceptoDeAdmisionController {
  constructor(private readonly conceptoService: ConceptoDeAdmisionService) {}

  @Get(':oid/:tipo')
  async getmedicamentos(@Param('oid') id: string, @Param('tipo') tipo: string) {
    return await this.conceptoService.getmedicamentos(id, tipo);
  }

  @Post()
  async update(@Body() medicamentos: IMedicamentos[]) {
    return await this.conceptoService.updatemedicamento(medicamentos);
  }
}
