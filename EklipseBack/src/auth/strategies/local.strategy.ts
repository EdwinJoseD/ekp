import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef, REQUEST } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
    private readonly authService: AuthService
  ) {
    super({
      passReqToCallback: true,
      usernameField: 'identification',
      passwordField: 'password',
    });
  }

  async validate(request: Request, identification: string, password: string) {
    const context = ContextIdFactory.getByRequest(request);
    const authServices = await this.moduleRef.resolve(AuthService, context);
    const connection = authServices.switchConnection(request.body.connection);
    const user = await authServices.validateUser(
      identification,
      password,
      connection
    );
    if (!user)
      throw new UnauthorizedException(
        'Identificacion o Contraseña Incorrecta, Por Favor Verifica Tus Datos.'
      );
    return user;
  }
}
