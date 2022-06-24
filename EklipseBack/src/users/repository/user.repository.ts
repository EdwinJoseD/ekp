import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager, Repository } from 'typeorm';
import { Users } from '../entity';
import { IUserFindById } from '../interface';
import { Request } from 'express';

@Injectable()
export class UserRepository {
  private repository: Repository<Users>;
  private connection: Connection;

  // constructor(
  //   @Inject(REQUEST) request: Request,
  //   @Inject(forwardRef(() => AuthService))
  //   private readonly authService: AuthService
  // ) {
  //   try {
  //     const token = request.headers.authorization.split(' ')[1];
  //     this.connection = getManager(
  //       authService.getConnectionWithToken(token)
  //     ).connection;
  //   } catch (err) {
  //     throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
  //   }
  // }

  async getOneById(identification: IUserFindById, connection: string) {
    this.repository = getManager(connection).getRepository(Users);
    const query = await this.repository
      .createQueryBuilder('users')
      .where(identification)
      //.andWhere('users.status = 1')
      .addSelect('users.password')
      .getOne();
    return query;
  }

  async getAllUsers() {
    return await this.connection.manager.query(`SELECT G.OID id,
    G.GENROL idRol,
    R.ROLNOMBRE rol, 
    G.USUNOMBRE identification,
    G.USUDESCRI 'user'
    FROM GENUSUARIO G INNER JOIN GENROL R ON G.GENROL = R.OID
    WHERE G.USUESTADO = 1`);
  }
}
