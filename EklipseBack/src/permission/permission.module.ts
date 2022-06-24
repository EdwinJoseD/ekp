import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'SJ'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'AGU'),
    AuthModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
