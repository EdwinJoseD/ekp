import { Module } from '@nestjs/common';
import { PgpService } from './pgp.service';
import { PgpController } from './pgp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PgpRepository } from './repository/pgp.repository';
import { PgpAcostado, PgpConsolidado, PgpFacturado } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'AGU'),
    TypeOrmModule.forFeature([], 'VDP'),
    AuthModule,
  ],
  controllers: [PgpController],
  providers: [
    PgpService,
    PgpRepository,
    PgpFacturado,
    PgpAcostado,
    PgpConsolidado,
  ],
})
export class PgpModule {}
