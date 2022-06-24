import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, User } from 'src/common/decorators';
import { Users } from 'src/users/entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GcmUsuario } from './entity/gcmusuario.entity';
import { LocalAuthGuard } from './guards';

@ApiTags('Autenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() login: AuthDto, @User() user: GcmUsuario) {
    const connection = login.connection;
    const data = await this.authService.login(user, connection);
    return data;
  }

  @Auth()
  @Get('profile')
  async profile(@User() user: Users) {
    if (!user) {
      return {
        success: false,
        Message: 'Not found User',
      };
    } else {
      return {
        success: true,
        Message: 'User Profile',
        data: user,
      };
    }
  }

  @Auth()
  @Get('refresh')
  async refresh(@User() user: GcmUsuario) {
    const data = await this.authService.login(user);
    return data;
  }
}
