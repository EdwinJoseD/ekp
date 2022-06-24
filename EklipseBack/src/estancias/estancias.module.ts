import { Module } from '@nestjs/common';
import { EstanciasService } from './estancias.service';
import { EstanciasController } from './estancias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([], 'AC'), AuthModule],
  providers: [EstanciasService],
  controllers: [EstanciasController],
})
export class EstanciasModule {}
