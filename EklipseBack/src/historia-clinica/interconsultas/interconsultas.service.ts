import { Injectable } from '@nestjs/common';
import { Response } from 'src/common/models';
import { InterconsultasRepository } from './repository';

@Injectable()
export class InterconsultasService {
  constructor(
    private readonly interconsultaRepository: InterconsultasRepository
  ) {}

  async getInterconsultas(): Promise<Response> {
    const data = await this.interconsultaRepository.getEspecialidad();

    if (data && data.length > 0) {
      return {
        success: true,
        message: 'Interconsultas Por Especialidades',
        data,
      };
    } else {
      return {
        success: false,
        message: 'Sin Especialidades Que Mostrar',
        data,
      };
    }
  }

  async getPacientes(id: number): Promise<Response> {
    const data = await this.interconsultaRepository.getPacientes(id);
    if (data && data.length > 0) {
      return {
        success: true,
        message: 'Pacientes Por Especialidades',
        data,
      };
    } else {
      return {
        success: false,
        message: 'Sin Pacientes Que Mostrar',
        data,
      };
    }
  }
}
