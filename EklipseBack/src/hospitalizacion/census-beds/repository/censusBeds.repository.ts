import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';

@Injectable()
export class CensusBedsRepository {
  private connection: Connection;
  constructor(@Inject(REQUEST) req: Request, private authService: AuthService) {
    const token = req.headers.authorization.split(' ')[1];
    this.connection = getManager(
      authService.getConnectionWithToken(token)
    ).connection;
  }

  async getCensusBeds() {
    return await this.connection.manager.query(
      `SELECT 
      G.HGRCODIGO, 
      G.HGRNOMBRE, 
      COUNT(G.HCACODIGO) CAMAS,
      COUNT(CASE HCAESTADO WHEN 2 THEN  HCAESTADO ELSE NULL END) OCUPADAS,
      COUNT(CASE HCAESTADO WHEN 1 THEN  HCAESTADO ELSE NULL END) DESOCUPADAS
      FROM GCVHOSCENCAM G GROUP BY G.HGRCODIGO, G.HGRNOMBRE ORDER BY G.HGRCODIGO`
    );
  }

  async getGroupCensusBeds(grupo: string) {
    return await this.connection.manager.query(
      `SELECT 
      HSUCODIGO,
      HSUNOMBRE,
      COUNT(G.HCACODIGO) CAMAS,
      COUNT(CASE HCAESTADO WHEN 2 THEN  HCAESTADO ELSE NULL END) OCUPADAS,
      COUNT(CASE HCAESTADO WHEN 1 THEN  HCAESTADO ELSE NULL END) DESOCUPADAS
      FROM GCVHOSCENCAM G 
      WHERE HGRCODIGO = @0
      GROUP BY HSUCODIGO, HSUNOMBRE`,
      [grupo]
    );
  }

  async getBeds() {
    const res = await this.connection.manager.query(
      `SELECT 
      HCAESTADO,
	    HSUCODIGO,
      HCACODIGO,
      GPADOCPAC,
      GPANOMPAC,
      AINCONSEC,
      GDENOMBRE, 
      ACANOMBRE
      FROM GCVHOSCENCAM
      ORDER BY GPADOCPAC DESC`
    );
    return res;
  }
}
