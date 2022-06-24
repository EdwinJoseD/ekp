import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

export class PgpRepository {
  private pgpRepository: Connection;
  private conexion: string;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.pgpRepository = getManager(this.conexion).connection;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async agrupadores() {
    if (this.conexion === 'VDP') {
      const agrupadores = ['S12101'];

      try {
        for (let i = 0; i < agrupadores.length; i++) {
          console.log(i + 1, ' ', agrupadores[i]);
          await this.pgpRepository.manager.query(
            `INSERT INTO GCMAGRUPGP
            SELECT
             RTrim(LTrim(GENSERIPS.SIPCODIGO)) As COD_SERIPS,
             RTrim(LTrim(GENSERIPS.SIPCODCUP)) As COD_CUPS,
             RTrim(LTrim(Replace(Replace(GENSERIPS.SIPNOMBRE, Char(10), ''), Char(13),
             ''))) As NOM_SERVIPS,
             GENARESER.GASCODIGO CODAREA,
            'UCI NEONATAL' AS AGRUPADOR,
            15 ORDEN,
            'I202' CONTRATO
              FROM GENSERIPS
              Inner Join GENGRUPOS On GENGRUPOS.OID = GENSERIPS.GENGRUPOS1
              Inner Join GENSUBGRU On GENSUBGRU.OID = GENSERIPS.GENSUBGRU1
              Inner Join GENARESER On GENARESER.OID = GENSERIPS.GENARESER1
              WHERE RTrim(LTrim(GENSERIPS.SIPCODIGO)) = @0;`,
            [agrupadores[i]]
          );
        }
        console.log('termino AGU');
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log('no es la valle');
    }
  }
}
