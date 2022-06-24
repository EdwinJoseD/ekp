import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getManager, Repository } from 'typeorm';
import { Request } from 'express';
import { CenterAttention } from './entity';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'src/common/models';

@Injectable()
export class CenterOfAttentionService {
  private repository: Repository<CenterAttention>;
  constructor(
    private authService: AuthService,
    @Inject(REQUEST) request: Request
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.repository = getManager(
        authService.getConnectionWithToken(token)
      ).getRepository(CenterAttention);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getAllCenter(): Promise<Response> {
    try {
      const data = await this.repository.find();
      if (!data) {
        return {
          success: false,
          message: 'No Se Encontraron Centros de Atención.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Centers',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  async getOneCenter(id: number): Promise<Response> {
    try {
      const data = await this.repository.find({ where: { id } });
      if (!data) {
        return {
          success: false,
          message: 'No se encontraron Centros de Atención',
          data,
        };
      } else {
        return { success: true, message: 'Centro de Atención', data };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }
}
