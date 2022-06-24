import { Module } from '@nestjs/common';
import { RadicacionDeFacturacionModule } from './radicacion-de-facturacion/radicacion-de-facturacion.module';
import { FacturacionPorPeriodoModule } from './facturacion-por-periodo/facturacion-por-periodo.module';
import { PgpModule } from './pgp/pgp.module';

@Module({
  imports: [
    RadicacionDeFacturacionModule,
    FacturacionPorPeriodoModule,
    PgpModule,
  ],
  exports: [
    RadicacionDeFacturacionModule,
    PgpModule,
    FacturacionPorPeriodoModule,
  ],
  providers: [],
})
export class InformesGerencialesModule {}
