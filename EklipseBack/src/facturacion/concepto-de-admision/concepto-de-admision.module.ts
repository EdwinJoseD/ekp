import { Module } from '@nestjs/common';
import { ConceptoDeAdmisionService } from './concepto-de-admision.service';
import { ConceptoDeAdmisionController } from './concepto-de-admision.controller';
import { ConceptoRepository } from './repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'AC'),
    TypeOrmModule.forFeature([], 'AGU'),
    TypeOrmModule.forFeature([], 'VDP'),
    TypeOrmModule.forFeature([], 'SJ'),
    AuthModule,
  ],
  providers: [ConceptoDeAdmisionService, ConceptoRepository],
  controllers: [ConceptoDeAdmisionController],
})
export class ConceptoDeAdmisionModule {}
