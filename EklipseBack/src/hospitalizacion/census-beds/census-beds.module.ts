import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CensusBedsController } from './census-beds.controller';
import { CensusBedsService } from './census-beds.service';
import { CensusBedsRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'SJ'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'AGU'),
    AuthModule,
  ],
  controllers: [CensusBedsController],
  providers: [CensusBedsService, CensusBedsRepository],
})
export class CensusBedsModule {}
