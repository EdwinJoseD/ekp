import { Module } from '@nestjs/common';
import { SubgroupBedsService } from './subgroup-beds.service';
import { SubgroupBedsController } from './subgroup-beds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubgroupBeds } from './entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubgroupBeds], 'AC'),
    TypeOrmModule.forFeature([SubgroupBeds], 'SJ'),
    TypeOrmModule.forFeature([SubgroupBeds], 'VDP'),
    TypeOrmModule.forFeature([SubgroupBeds], 'AGU'),
    AuthModule,
  ],
  providers: [SubgroupBedsService],
  controllers: [SubgroupBedsController],
})
export class SubgroupBedsModule {}
