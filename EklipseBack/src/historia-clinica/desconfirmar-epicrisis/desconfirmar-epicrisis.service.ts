import { BadRequestException, Injectable } from '@nestjs/common';
import { EpicrisisRepository } from './repository';

@Injectable()
export class DesconfirmarEpicrisisService {
  constructor(private readonly epicrisisRepository: EpicrisisRepository) {}

  async getEpicrisis(consecutivo) {
    try {
      const data = await this.epicrisisRepository.getEpicrisis(consecutivo);
      if (data) {
        return { success: true, message: 'Epicrisis', data };
      } else {
        return {
          success: false,
          message: 'No se Encontro Epicrisis Para Desconfirmar',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async desconfirmar(consecutivo) {
    try {
      await this.epicrisisRepository.desconfirmar(consecutivo);
      return {
        success: true,
        message: 'Epicrisis Desconfirmaada Con Exito',
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al Desconfrimar Epicrisis',
        error.message
      );
    }
  }
}
