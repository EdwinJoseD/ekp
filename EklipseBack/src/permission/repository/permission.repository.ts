import { Inject, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

export class PermissionRepository {
  private connection: Connection;
  private id: string;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.id = authService.payload(token).idUsuario;
      this.connection = getManager(
        authService.getConnectionWithToken(token)
      ).connection;
    } catch (err) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getPermisosActivos() {
    const userPermiss = await this.connection.manager.query(
      `SELECT M.CLAVE 
      FROM GENUSUARIO U 
      INNER JOIN GCMUSUPERMISO P ON P.IDUSUARIO = U.OID 
      INNER JOIN GCMMODULOS M ON M.OID = P.IDMODULO 
      WHERE U. OID = @0  AND P.ACTIVO =1
    `,
      [this.id]
    );
    const permiss = [];
    userPermiss.forEach((user) => {
      permiss.push(user.CLAVE);
    });
    return permiss;
  }
}
