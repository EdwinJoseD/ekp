import { Module } from '@nestjs/common';
import { CenterOfAttentionService } from './center-of-attention.service';
import { CenterOfAttentionController } from './center-of-attention.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CenterAttention } from './entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CenterAttention], 'AC'),
    TypeOrmModule.forFeature([CenterAttention], 'SJ'),
    TypeOrmModule.forFeature([CenterAttention], 'VDP'),
    TypeOrmModule.forFeature([CenterAttention], 'AGU'),
    AuthModule,
  ],
  providers: [CenterOfAttentionService],
  controllers: [CenterOfAttentionController],
})
export class CenterOfAttentionModule {}
