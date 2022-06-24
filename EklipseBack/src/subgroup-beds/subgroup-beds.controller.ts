import { Get, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { SubgroupBedsService } from './subgroup-beds.service';

@Auth()
@ApiTags('Subgrupo de Camas')
@Controller('subgroup')
export class SubgroupBedsController {
  constructor(private readonly subgroupService: SubgroupBedsService) {}

  @Get()
  async getAllSubgroup(@Query('center') center?: number) {
    const subgroup = await this.subgroupService.getAllSubgroup(center);
    return subgroup;
  }

  @Get(':id')
  async getOneSubgroup(@Param('id') id: number) {
    const subgroup = await this.subgroupService.getOneSubgroup(id);
    return subgroup;
  }
}
