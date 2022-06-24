import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from './entity';
import { UserRepository } from './repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Users], 'AC'),
    TypeOrmModule.forFeature([Users], 'SJ'),
    TypeOrmModule.forFeature([Users], 'VDP'),
    TypeOrmModule.forFeature([Users], 'AGU'),
    CacheModule.register(),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
