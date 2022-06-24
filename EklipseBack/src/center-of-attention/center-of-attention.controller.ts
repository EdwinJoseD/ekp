import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { CenterOfAttentionService } from './center-of-attention.service';

@Auth()
@ApiTags('Centro de Atencion')
@Controller('center-of-attention')
export class CenterOfAttentionController {
  constructor(private readonly centerServcices: CenterOfAttentionService) {}

  @Get()
  async getAllCenterOfAttention() {
    const centers = await this.centerServcices.getAllCenter();
    return centers;
  }

  @Get(':id')
  async getOneCenterOfAttention(@Param('id') id: number) {
    const center = await this.centerServcices.getOneCenter(id);
    return center;
  }
}
