import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class InterconsultasRepository {
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

  async getEspecialidad() {
    return await this.repository.manager.query(
      `SELECT
      *
      FROM GCVHCNINTERC 
      WHERE HCNINTERR IS NULL AND AINESTADO = 0 AND HCIREGSUS = 0
      --GROUP BY GENESPECI, GEEDESCRI`
    );
  }

  async getPacientes(id) {
    return await this.repository.manager.query(
      `SELECT * 
      FROM GCVHCNINTERC 
      WHERE HCNINTERR IS NULL AND AINESTADO = 0 AND HCIREGSUS = 0
      AND GENESPECI = @0`,
      [id]
    );
  }
}
