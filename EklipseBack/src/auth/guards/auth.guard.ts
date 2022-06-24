import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from 'src/users/entity';
import { getManager, Connection } from 'typeorm';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private repository: Connection;
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async getUser(id: number, conn: string) {
    try {
      this.repository = getManager(conn).connection;
      return await this.repository.manager.query(
        `
      SELECT "Users"."OID" AS "id", 
      "Users"."GENROL" AS "idRol",
      "Users"."USUNOMBRE" AS "identificacion", 
      "Users"."USUDESCRI" AS "user",
      "Users"."USUESTADO" AS "status"
      FROM "GENUSUARIO" "Users" 
      WHERE "Users"."OID" = @0`,
        [id]
      );
    } catch (error) {
      throw new BadRequestException('Algo anda mal', error.message);
    }
  }

  async findUser(id: number, conn: string) {
    try {
      this.repository = getManager(conn).connection;
      return await this.repository.manager.query(
        `
      SELECT "Users"."OID" AS "id", 
      "Users"."GENROL" AS "idRol",
      "Users"."USUNOMBRE" AS "identificacion", 
      "Users"."USUDESCRI" AS "user",
      "Users"."USUESTADO" AS "status"
      FROM "GENUSUARIO" "Users" 
      WHERE "Users"."OID" = @0`,
        [id]
      );
    } catch (error) {
      throw new BadRequestException('Algo anda mal', error.message);
    }
  }

  async getRoles(id: number, conn: string): Promise<any[]> {
    this.repository = getManager(conn).connection;
    try {
      const user = await this.findUser(id, conn);
      return await this.repository.query(
        `SELECT P.OID, P.GENROL, R.ROLNOMBRE, P.GCMPERMISO, GP.NOMBRE, P.ACTIVO
        FROM GCMROLPERMISO P
        LEFT JOIN GENROL R ON P.GENROL=R.OID
        INNER JOIN GCMPERMISO GP ON GP.OID = P.GCMPERMISO
        WHERE R.OID = @0;`,
        [user.idRol]
      );
    } catch (error) {
      throw new BadRequestException('Algo anda mal', error.message);
    }
  }

  async getPermiss(id?: number, connection?: string) {
    const repository: Connection = await getManager(connection).connection;
    const userPermiss = await repository.manager.query(
      `SELECT M.CLAVE 
      FROM GENUSUARIO U 
      INNER JOIN GCMUSUPERMISO P ON P.IDUSUARIO = U.OID 
      INNER JOIN GCMMODULOS M ON M.OID = P.IDMODULO 
      WHERE U. OID = @0  AND P.ACTIVO =1
    `,
      [id]
    );
    const permiss = [];
    userPermiss.forEach((user) => {
      permiss.push(user.CLAVE);
    });
    return permiss;
  }

  async canActivate(context: ExecutionContext) {
    try {
      //const req: Request = context.switchToHttp().getRequest();
      //const token = req.headers.authorization.split(' ')[1];
      //const payload = this.authService.payload(token);
      //const connection = this.authService.switchConnection(payload.connection);
      //const idUsuario = payload.idUsuario;
      //const roles = await this.getRoles(idUsuario, connection);
      //console.log(req, token, payload, connection, roles);
      return true;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO aaa');
    }
  }
}
