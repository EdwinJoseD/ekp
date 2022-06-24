import { Module } from '@nestjs/common';
import { RadicacionDeFacturacionService } from './radicacion-de-facturacion.service';
import { RadicacionDeFacturacionController } from './radicacion-de-facturacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RadicacionRepository } from './repository';
import { GcvRadFac } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GcvRadFac], 'AC'),
    TypeOrmModule.forFeature([GcvRadFac], 'SJ'),
    TypeOrmModule.forFeature([GcvRadFac], 'AGU'),
    TypeOrmModule.forFeature([GcvRadFac], 'VDP'),
    AuthModule,
  ],
  providers: [RadicacionDeFacturacionService, RadicacionRepository],
  controllers: [RadicacionDeFacturacionController],
})
export class RadicacionDeFacturacionModule {}
