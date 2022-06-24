import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { DesconfirmarEpicrisisService } from './desconfirmar-epicrisis.service';

@Auth()
@ApiTags('Desconfirmar Epicrisis')
@Controller('epicrisis')
export class DesconfirmarEpicrisisController {
  constructor(
    private readonly epicrisisService: DesconfirmarEpicrisisService
  ) {}

  @Get(':consecutivo')
  async getEpicrisis(@Param('consecutivo') consecutivo: string) {
    return await this.epicrisisService.getEpicrisis(consecutivo);
  }

  @Get('/desconfirmar/:consecutivo')
  async desconfirmar(@Param('consecutivo') consecutivo: string) {
    return await this.epicrisisService.desconfirmar(consecutivo);
  }
}
