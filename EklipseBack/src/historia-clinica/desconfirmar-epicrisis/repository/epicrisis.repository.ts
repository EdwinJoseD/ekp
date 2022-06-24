import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class EpicrisisRepository {
  private repository: Connection;
  private conexion: string;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.repository = getManager(this.conexion).connection;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getEpicrisis(consecutivo) {
    return await this.repository.manager.query(
      `SELECT 
      A.AINCONSEC Ingreso,
      E.HCECONSEC Epicrisis,
      E.HCEFECDOC Fecha,
      P.PACNUMDOC Documento,
      P.PACEXPEDI Expedicion,
      P.GPANOMCOM Paciente,
      M.GMENOMCOM Medico,
      (CASE 
      WHEN E.HCEESTDOC = 0 THEN 'REGISTRADA'
      WHEN E.HCEESTDOC = 1 THEN 'CONFIRMADA'
      END)Estado
      FROM HCNEPICRI E
      INNER JOIN ADNINGRESO A ON E.ADNINGRESO = A.OID
      INNER JOIN GENPACIEN P ON E.GENPACIEN = P.OID
      INNER JOIN GENMEDICO M ON E.GENMEDICO = M.OID
      WHERE E.HCECONSEC = @0 AND E.HCEESTDOC = 1`,
      [consecutivo]
    );
  }

  async desconfirmar(consecutivo) {
    return await this.repository.manager.query(
      `UPDATE HCNEPICRI
       SET HCEESTDOC = 0
       WHERE HCECONSEC = @0`,
      [consecutivo]
    );
  }
}
