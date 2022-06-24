import { Module } from '@nestjs/common';
import { UciSheetsService } from './uci-sheets.service';
import { UciSheetsController } from './uci-sheets.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UciSheetsRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'SJ'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'AGU'),
    AuthModule,
  ],
  providers: [UciSheetsService, UciSheetsRepository],
  controllers: [UciSheetsController],
  exports: [UciSheetsService],
})
export class UciSheetsModule {}
