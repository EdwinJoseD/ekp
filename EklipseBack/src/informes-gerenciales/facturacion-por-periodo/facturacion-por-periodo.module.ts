import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
//import { GCVUSUFACTUR } from './entity';
import { FacturacionPorPeriodoController } from './facturacion-por-periodo.controller';
import { FacturacionPorPeriodoService } from './facturacion-por-periodo.service';
//import { Helpers } from './helpers';
import { FacturacionRepository } from './repository';
import { FacturacionUsuarioRepository } from './repository/facturacionUsuario.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'AGU'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'SJ'),
    AuthModule,
  ],
  controllers: [FacturacionPorPeriodoController],
  providers: [
    FacturacionPorPeriodoService,
    FacturacionRepository,
    FacturacionUsuarioRepository,
  ],
})
export class FacturacionPorPeriodoModule {}
