import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { PermissionService } from './permission.service';

@ApiTags('Permisos')
@Auth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getPermiss() {
    return await this.permissionService.getPermissions();
  }
}
