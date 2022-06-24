import {
  Get,
  Param,
  Controller,
  Req,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { UsersService } from './users.service';
import { Request } from 'express';

@ApiTags('Usuarios')
@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getAll(@Req() req: Request) {
    const users = await this.userServices.findAll(req);
    return users;
  }

  @Get(':id')
  async getByIdentification(
    @Param('id') identification: string,
    @Req() req: Request
  ) {
    const conn = req.headers.authorization.split(' ')[1];
    const user = await this.userServices.findOne(identification, conn);
    return user;
  }
}
