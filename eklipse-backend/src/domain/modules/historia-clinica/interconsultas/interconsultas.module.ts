import { Module } from '@nestjs/common';
import { InterconsultasService } from './interconsultas.service';
import { InterconsultasController } from './interconsultas.controller';

@Module({
  controllers: [InterconsultasController],
  providers: [InterconsultasService]
})
export class InterconsultasModule {}
