import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getManager, Repository } from 'typeorm';
import { SubgroupBeds } from './entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SubgroupBedsService {
  private subgroupRepository: Repository<SubgroupBeds>;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.subgroupRepository = getManager(
        authService.getConnectionWithToken(token)
      ).getRepository(SubgroupBeds);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getAllSubgroup(center?: number) {
    try {
      //const data = await this.subgroupRepository.find();
      if (center) {
        const data = await this.subgroupRepository.manager.query(
          `SELECT DISTINCT (A.OID), A.HSUCODIGO, A.HSUNOMBRE, B.ADNCENATE FROM HPNSUBGRU A 
        INNER JOIN HPNDEFCAM B ON A.OID = B.HPNSUBGRU WHERE B.ADNCENATE = @0`,
          [center]
        );
        if (!data) {
          return {
            success: false,
            message: 'No se Encontraron Subgrupos',
          };
        } else {
          return {
            success: true,
            message: 'Subgrupos',
            data,
          };
        }
      } else {
        const data = await this.subgroupRepository.manager.query(
          `SELECT DISTINCT (A.OID), A.HSUCODIGO, A.HSUNOMBRE, B.ADNCENATE FROM HPNSUBGRU A 
        INNER JOIN HPNDEFCAM B ON A.OID = B.HPNSUBGRU`,
          []
        );
        if (!data) {
          return {
            success: false,
            message: 'No se Encontraron Subgrupos',
          };
        } else {
          return {
            success: true,
            message: 'Subgrupos',
            data,
          };
        }
      }
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un Problema en la Consulta. ',
        error.message
      );
    }
  }

  async getOneSubgroup(id: number) {
    try {
      const data = await this.subgroupRepository.find({ where: { id } });
      if (!data) {
        return {
          success: false,
          message: 'No se Encontro Subgrupo',
        };
      } else {
        return {
          success: true,
          message: 'Subgrupo',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('No hay SubGrupos de Camas');
    }
  }
}
