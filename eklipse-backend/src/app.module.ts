import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { conVDP } from "./infrastructure/databases/VDP.connection";
import { conAGU } from "./infrastructure/databases/AGU.connection";
import { conAC } from "./infrastructure/databases/AC.connection";
import { conSJ } from "./infrastructure/databases/SJ.connection";
import { InformesGerencialesModule } from "./domain/modules/informes-gerenciales/informes-gerenciales.module";
import { BalancesEnfermeriaModule } from "./domain/modules/balances-enfermeria/balances-enfermeria.module";
import { HistoriaClinicaModule } from "./domain/modules/historia-clinica/historia-clinica.module";
import { HospitalizacionModule } from "./domain/modules/hospitalizacion/hospitalizacion.module";
import { FacturacionModule } from "./domain/modules/facturacion/facturacion.module";
import { SeguridadModule } from "./domain/modules/seguridad/seguridad.module";
import { CarteraModule } from "./domain/modules/cartera/cartera.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 2400000,
      max: 5000,
    }),
    TypeOrmModule.forRoot({
      ...conAC,
      name: "AC",
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...conVDP,
      name: "VDP",
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...conAGU,
      name: "AGU",
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...conSJ,
      name: "SJ",
      autoLoadEntities: true,
    }),
    SeguridadModule,
    BalancesEnfermeriaModule,
    HospitalizacionModule,
    HistoriaClinicaModule,
    FacturacionModule,
    InformesGerencialesModule,
    CarteraModule,
  ],
})
export class AppModule {}
