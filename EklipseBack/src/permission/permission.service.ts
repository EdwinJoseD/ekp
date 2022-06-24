import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionRepository } from './repository';
import { Response } from 'src/common/models';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPermissions(): Promise<Response> {
    try {
      const data = await this.permissionRepository.getPermisosActivos();
      if (!data) {
        return {
          success: false,
          message: 'No se Encontraron Permisos',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Permisos',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un Error al obtener los permisos ',
        error.message
      );
    }
  }
}
