import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class PatientsRepository {
  private readonly connection: Connection;
  constructor(@Inject(REQUEST) req: Request, private authService: AuthService) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      this.connection = getManager(
        authService.getConnectionWithToken(token)
      ).connection;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }
  async getPatients(center): Promise<any[]> {
    return await this.connection.query(
      'SELECT * FROM GCVHOSCENPAC WHERE HESFECSAL IS \
      NULL AND HCAESTADO<3 AND ADNCENATE=@0 ORDER BY GPADOCPAC;',
      [center]
    );
  }

  async getPatientsEvol(adncenate: number, subgroup: string): Promise<any[]> {
    return await this.connection.query(
      'SELECT * FROM GCVHOSDIEEVO WHERE HPNESTANC IN \
      (SELECT HPNESTANC FROM GCVHOSCENPAC WHERE HESFECSAL \
      IS NULL AND HCAESTADO<3 AND ADNCENATE = @0 AND HSUCODIGO = @1);',
      [adncenate, subgroup]
    );
  }

  async getPatientsForDiets(
    adncenate: number,
    subgroup: string
  ): Promise<any[]> {
    return await this.connection.query(
      `SELECT C.HCACODIGO AS CAMA, 
      G.HPNESTANC,
        C.GPANOMPAC, 
        G.HCSFECFOL, 
        G.HCSDIETIP AS DIEGRUTIP, 
        G.HCSDIENOM, 
        G.HCSDIECON AS DIEGRUCON,
      G.HCSDIEOBS AS DIEGRUOBS,
        G.GEEDESCRI, 
      G.GMENOMCOM
        FROM GCVHOSDIEEVO G 
        RIGHT JOIN GCVHOSCENPAC C 
        ON C.HPNESTANC = G.HPNESTANC 
        WHERE C.HESFECSAL 
        IS NULL AND C.HCAESTADO<3 
        AND C.ADNCENATE = @0
        AND C.HSUCODIGO = @1;`,
      [adncenate, subgroup]
    );
  }
}
