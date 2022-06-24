import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'src/common/models';
import { CensusBedsRepository } from './repository';

@Injectable()
export class CensusBedsService {
  constructor(private CensusBedsRepository: CensusBedsRepository) {}

  async getCensoCamas(): Promise<Response> {
    try {
      const data = await this.CensusBedsRepository.getCensusBeds();
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Camas',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Censo de Camas.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  async getGroupCensoCamas(grupo: string): Promise<Response> {
    try {
      const data = await this.CensusBedsRepository.getGroupCensusBeds(grupo);
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Camas',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Censo de Camas.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  async getCamas(): Promise<Response> {
    try {
      const data = await this.CensusBedsRepository.getBeds();
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Camas',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Censo de Camas.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }
}
