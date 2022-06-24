import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Si al momento de realizar una peticion no estas utenticado entrara a esta funcion
    if (err || !user) {
      throw err || new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
    return user;
  }
}
