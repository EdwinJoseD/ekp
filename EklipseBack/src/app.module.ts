import {
  BadGatewayException,
  CacheModule,
  Catch,
  Module,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {
  ConnectionAC,
  ConnectionAGU,
  ConnectionSJ,
  ConnectionVDP,
} from './config/database';
import { CenterOfAttentionModule } from './center-of-attention/center-of-attention.module';
import { SubgroupBedsModule } from './subgroup-beds/subgroup-beds.module';
import { HospitlizacionModule } from './hospitalizacion/hospitlizacion.module';
import { UciSheetsModule } from './uci-sheets/uci-sheets.module';
import { InformesGerencialesModule } from './informes-gerenciales/informes-gerenciales.module';
import { PermissionModule } from './permission/permission.module';
import { HistoriaClinicaModule } from './historia-clinica/historia-clinica.module';
import { FacturacionModule } from './facturacion/facturacion.module';
import { CarteraModule } from './cartera/cartera.module';
import { EstanciasModule } from './estancias/estancias.module';

@Catch(BadGatewayException)
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 2400000,
      max: 5000,
    }),
    TypeOrmModule.forRoot({
      ...ConnectionAC,
      name: 'AC',
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...ConnectionVDP,
      name: 'VDP',
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...ConnectionAGU,
      name: 'AGU',
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...ConnectionSJ,
      name: 'SJ' || '',
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    CenterOfAttentionModule,
    SubgroupBedsModule,
    HospitlizacionModule,
    UciSheetsModule,
    InformesGerencialesModule,
    PermissionModule,
    HistoriaClinicaModule,
    FacturacionModule,
    CarteraModule,
    EstanciasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
