import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { CensusBedsService } from './census-beds.service';

@Auth()
@ApiTags('Censo De Camas')
@Controller('censo-camas')
export class CensusBedsController {
  constructor(private readonly censusBedsService: CensusBedsService) {}

  @Get()
  async getCensusBeds() {
    return await this.censusBedsService.getCensoCamas();
  }

  @Get('grupo/:grupo')
  async getGroupCensusBeds(@Param('grupo') grupo: string) {
    return await this.censusBedsService.getGroupCensoCamas(grupo);
  }

  @Get('list')
  async getBeds() {
    return await this.censusBedsService.getCamas();
  }
}
