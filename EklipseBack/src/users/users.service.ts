import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { getManager, Repository } from 'typeorm';
import { Request } from 'express';
import { Users } from './entity';
import { IUserFindById } from './interface/userFindById.interface';
import { UserRepository } from './repository';
import { Response } from 'src/common/models';

@Injectable()
export class UsersService {
  private repository: Repository<Users>;
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  async findAll(request: Request): Promise<Response> {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.repository = await getManager(
        this.authService.getConnectionWithToken(token)
      ).getRepository(Users);

      const data = await this.repository.find({ status: 1 });
      if (!data) {
        return {
          success: false,
          message: 'No hay Usuarios Disponibles',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Usuarios Disponibles',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ha Ocurrio un Error', error.message);
    }
  }

  async getAll(): Promise<Response> {
    try {
      const data = await this.userRepo.getAllUsers();
      if (!data) {
        return {
          success: false,
          message: 'No hay Usuarios Disponibles',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Usuarios Disponibles',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ha Ocurrio un Error', error.message);
    }
  }

  async findOne(identification: string, connection: string): Promise<Response> {
    this.repository = getManager(
      this.authService.getConnectionWithToken(connection)
    ).getRepository(Users);
    try {
      const data = await this.repository.findOne({ identification });
      if (!data) {
        return {
          success: false,
          message: 'No hay Usuarios Disponibles',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Usuario Disponibles',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'No existe el Usuario con la identificacion ',
        identification
      );
    }
  }

  async findOneForValidationJWT(id: number, conn: string): Promise<Users> {
    try {
      this.repository = getManager(
        this.authService.switchConnection(conn)
      ).getRepository(Users);
      const user = await this.repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
      return user;
    } catch (error) {
      throw new BadRequestException('El Usuario No Existe', error.message);
    }
  }

  async findOneByIdentificationForAuth(
    identification: IUserFindById,
    connection: string
  ): Promise<Users> {
    try {
      const users = await this.userRepo.getOneById(identification, connection);
      return users;
    } catch (error) {
      throw new BadRequestException('El Usuario No Existe', error.message);
    }
  }
}
