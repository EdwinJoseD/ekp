import { Module } from '@nestjs/common';
import { ConciliacionService } from './conciliacion.service';
import { ConciliacionController } from './conciliacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConciliacionRepository } from './repository';
import { ConciliacionCarteraEntity } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConciliacionCarteraEntity], 'AC'),
    //TypeOrmModule.forFeature([], 'AGU'),
    //TypeOrmModule.forFeature([], 'VDP'),
    //TypeOrmModule.forFeature([], 'SJ'),
    AuthModule,
  ],
  providers: [ConciliacionService, ConciliacionRepository],
  controllers: [ConciliacionController],
})
export class ConciliacionModule {}
