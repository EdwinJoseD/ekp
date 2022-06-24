import { getManager, Repository } from 'typeorm';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DietaGrupo } from '../entity';
import { AuthService } from 'src/auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DietaGrupoRepository {
  public repository: Repository<DietaGrupo>;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.repository = getManager(
        authService.getConnectionWithToken(token)
      ).getRepository(DietaGrupo);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async findDietaGrupo(
    dietaJornada: number,
    subgroup: number
  ): Promise<DietaGrupo> {
    const res = await this.repository.findOne({ dietaJornada, subgroup });
    if (!res) {
      return null;
    }
    return res;
  }
}
