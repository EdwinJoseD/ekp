import { getManager, Repository } from 'typeorm';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DietaJornada } from '../entity';
import { AuthService } from 'src/auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CenterAttention } from 'src/center-of-attention/entity';

@Injectable()
export class DietaJornadaRepository {
  public repository: Repository<DietaJornada>;
  public repositoryCenter: Repository<CenterAttention>;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.repository = getManager(
        authService.getConnectionWithToken(token)
      ).getRepository(DietaJornada);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async findDietaJornada(fechaDieta: Date): Promise<DietaJornada[]> {
    const fecha = fechaDieta.toISOString().split('T')[0];
    const res = await this.repository.find({
      fechaDieta: fecha,
    });

    if (res.length > 0) {
      const jornadas = [];
      res.forEach((f) => {
        const newJornada = {
          id: f.id,
          adncenate: f.getCenter(),
          fecha: f.fechaDieta,
          jornda: f.getJornada(),
        };
        jornadas.push(newJornada);
      });
      return jornadas;
    }
    return [];
  }

  async countDietaJornada(fechaDieta: Date) {
    const fecha = fechaDieta.toISOString().split('T')[0];
    const res = await this.repository.query(
      `select GCMDIEJOR, COUNT(*)AS PACIENTES from 
    GCMHOSDIEEST where DIEFECJOR = @0 group by GCMDIEJOR`,
      [fecha]
    );
    return res;
  }

  async jornada(fecha) {
    const fech = fecha.toISOString().split('T')[0];
    return this.repository.query(
      `SELECT
(CASE DIEJORNAD
  WHEN 1 THEN 'DESAYUNO'
  WHEN 2 THEN 'ALMUERZO'
  WHEN 3 THEN 'CENA'
  ELSE ''
  END)
  FROM GCMHOSDIEJOR
  WHERE DIEFECJOR = @0`,
      [fech]
    );
  }

  async totalJornada(fecha) {
    const fech = fecha.toISOString().split('T')[0];
    return this.repository.query(
      `SELECT
      SUM((CASE G.DIEGRUCON
      WHEN 'LIQUIDA' THEN 3700
      WHEN 'LICUADOS SIN GRUMOS' THEN 3700
      ELSE P.PRECIO
      END)) AS TOTALJORNADA
      FROM GCMHOSDIEEST G
      INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
      INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
      WHERE G.DIEFECJOR = @0 GROUP BY G.GCMDIEJOR;`,
      [fech]
    );
  }
}
