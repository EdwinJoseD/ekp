import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entity';
import { UsersService } from 'src/users/users.service';
import { Repository, getManager, Connection } from 'typeorm';
import { EncodePassword } from '../common/helpers';
import { GcmUsuario } from './entity/gcmusuario.entity';

@Injectable()
export class AuthService {
  private repository: Repository<GcmUsuario>;
  constructor(
    private readonly jwtService: JwtService,
    private readonly encodeService: EncodePassword,
    @Inject(forwardRef(() => UsersService))
    private readonly UserService: UsersService
  ) {}

  async validateUser(
    identification: string,
    password: string,
    connection: string
  ) {
    const user = await this.UserService.findOneByIdentificationForAuth(
      { identification },
      connection
    );
    if (user && user.password == this.encodeService.encode(password)) {
      const { id, ...rest } = user;
      const userForSaved: GcmUsuario = {
        idUsuario: id,
        ultimaConexion: new Date(),
        token: this.jwtService.sign({ id, connection }),
      };
      const gcmuser = await this.getUser(id, connection);
      if (!gcmuser) {
        return this.saved(userForSaved, connection);
      }
      return gcmuser;
    }
    return null;
  }

  async login(user: GcmUsuario, connection?: string) {
    try {
      this.repository = getManager(
        this.switchConnection(connection)
      ).getRepository(GcmUsuario);
      const { idUsuario, ...rest } = user;
      const userinfo = await getManager(this.switchConnection(connection))
        .getRepository(Users)
        .find({ where: { id: idUsuario } });
      const userPermiss = await this.getPermiss(idUsuario, connection);
      const sub = { idUsuario, connection };
      const payload = { sub };
      const token = this.jwtService.sign(payload);
      const userUpdate: GcmUsuario = { ...user, token };
      const datas = await this.repository.save(userUpdate);
      const data = { datas, userinfo, userPermiss };
      if (!data) {
        return {
          success: false,
          message: 'Fallo Algo en el Login',
        };
      } else {
        return {
          success: true,
          message: 'Login exitoso',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  getConnectionWithToken(token) {
    try {
      const payload = this.jwtService.decode(token);
      const connection = this.switchConnection(payload.sub.connection);
      return connection || null;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  payload(token) {
    const payload = this.jwtService.decode(token);
    return payload.sub;
  }

  async getUser(id?: number, connection?: string) {
    this.repository = await getManager(connection).getRepository(GcmUsuario);
    const userfind = await this.repository
      .createQueryBuilder('user')
      .where('user.idUsuario = :id', { id })
      .getOne();
    return userfind;
  }

  async getPermiss(id?: number, connection?: string) {
    const repository: Connection = await getManager(
      await this.switchConnection(connection)
    ).connection;
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

  async saved(user: GcmUsuario, connection: string) {
    this.repository = getManager(connection).getRepository(GcmUsuario);
    return await this.repository.save(user);
  }

  switchConnection(connection) {
    switch (connection) {
      case 'ALTA-CENTRO':
        return 'AC';
      case 'VALLEDUPAR':
        return 'VDP';
      case 'AGUACHICA':
        return 'AGU';
      case 'SANJUAN':
        return 'SJ';
      case 'AMMEDICAL':
        return 'AM';
      default:
        return 'AC';
    }
  }
}
