import { Module } from '@nestjs/common';
import { CentroAtencionService } from './centro-atencion.service';
import { CentroAtencionController } from './centro-atencion.controller';

@Module({
  controllers: [CentroAtencionController],
  providers: [CentroAtencionService]
})
export class CentroAtencionModule {}
