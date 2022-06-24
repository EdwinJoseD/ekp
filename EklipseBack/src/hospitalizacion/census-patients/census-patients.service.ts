import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getManager, Repository } from 'typeorm';
import { Request } from 'express';
import { CensoPacientes } from './entity/censoPaciente.entity';
import { CensusPatientsRepository } from './repository';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'src/common/models';

@Injectable()
export class CensusPatientsService {
  private readonly patientsRepositoryEntity: Repository<CensoPacientes>;
  constructor(
    private readonly authService: AuthService,
    private readonly censusPatientsRepository: CensusPatientsRepository,
    @Inject(REQUEST) request: Request
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.patientsRepositoryEntity = getManager(
        authService.getConnectionWithToken(token)
      ).getRepository(CensoPacientes);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getPatients(): Promise<Response> {
    try {
      const data = await this.censusPatientsRepository.getCensusPatients();
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Pacientes.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Pacientes.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  async getPatientsForSubgroup(codArea: string): Promise<Response> {
    try {
      const data = await this.patientsRepositoryEntity.find({
        fechaSalida: null,
        codArea,
      });
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Pacientes.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Pacientes.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  async getControlDesk(ingreso): Promise<Response> {
    try {
      const data = this.censusPatientsRepository.controlDesk(ingreso);
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Pacinetes.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Pacinetes.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }
}
