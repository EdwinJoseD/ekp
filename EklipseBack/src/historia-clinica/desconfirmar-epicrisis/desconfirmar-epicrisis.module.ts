import { Module } from '@nestjs/common';
import { DesconfirmarEpicrisisService } from './desconfirmar-epicrisis.service';
import { DesconfirmarEpicrisisController } from './desconfirmar-epicrisis.controller';
import { EpicrisisRepository } from './repository';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DesconfirmarEpicrisisService, EpicrisisRepository],
  controllers: [DesconfirmarEpicrisisController],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'SJ'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'AGU'),
  ],
})
export class DesconfirmarEpicrisisModule {}
