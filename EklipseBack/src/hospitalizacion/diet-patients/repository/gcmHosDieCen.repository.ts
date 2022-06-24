import { getManager, Repository } from 'typeorm';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DietaCentro } from '../entity';
import { AuthService } from 'src/auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DietaCentroRepository {
  public repository: Repository<DietaCentro>;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.repository = getManager(
        authService.getConnectionWithToken(token)
      ).getRepository(DietaCentro);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async findDietaCentro(
    fechaDieta: Date,
    adncenate: number
  ): Promise<DietaCentro> {
    const res = await this.repository.findOne({
      fechaDieta: fechaDieta.toISOString().split('T')[0],
      adncenate,
    });
    if (!res) {
      return null;
    }
    return res;
  }
  async prueba() {
    const res = await this.repository.query(
      `select * from GCMHOSDIECEN order by OID desc;`
    );
    console.log(res);
  }

  async findLastDietaCentro() {
    return await this.repository.query(
      `select top 1 OID from GCMHOSDIECEN order by OID desc;`
    );
  }

  async findLastDietaJornada() {
    return await this.repository.query(
      `select top 1 OID from GCMHOSDIEJOR order by OID desc;`
    );
  }

  async findLastDietaGrupo() {
    return await this.repository.query(
      `select top 1 OID from GCMHOSDIEGRU order by OID desc;`
    );
  }

  async findLastDietaEstado() {
    return await this.repository.query(
      `select top 1 OID from GCMHOSDIEEST order by OID desc;`
    );
  }
}
