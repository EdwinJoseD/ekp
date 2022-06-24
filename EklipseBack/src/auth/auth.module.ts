import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy, LocalStrategy } from './strategies/';
import { EncodePassword } from 'src/common/helpers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GcmUsuario } from './entity';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([GcmUsuario], 'AC'),
    TypeOrmModule.forFeature([GcmUsuario], 'SJ'),
    TypeOrmModule.forFeature([GcmUsuario], 'VDP'),
    TypeOrmModule.forFeature([GcmUsuario], 'AGU'),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EncodePassword],
  exports: [AuthService],
})
export class AuthModule {}
