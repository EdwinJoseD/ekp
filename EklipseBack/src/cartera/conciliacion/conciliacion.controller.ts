import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Auth } from 'src/common/decorators';
import { ConciliacionService } from './conciliacion.service';
import { ConciliacionCarteraDto } from './dto';
import { editFileName, pdfFileFilter } from 'src/common/helpers';
import { Response } from 'express';
import * as path from 'path';

@Auth()
@ApiTags('Conciliacion')
@Controller('cartera/conciliacion')
export class ConciliacionController {
  constructor(private readonly service: ConciliacionService) {}

  @Get()
  async getConciliaciones() {
    return await this.service.getConciliaciones();
  }

  @Put(':id')
  async updateConciliacion(
    @Param('id') id: number,
    @Body() conciliacion: ConciliacionCarteraDto
  ) {
    return await this.service.updateConciliacion(id, conciliacion);
  }

  @Put('acta/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/actas',
        filename: editFileName,
      }),
      fileFilter: pdfFileFilter,
    })
  )
  async uploadfile(
    @Param('id') id: number,
    @UploadedFile() pdf: Express.Multer.File
  ) {
    return await this.service.updateActa(id, pdf.path);
  }

  @Delete(':oid')
  async deleteConciliacion(@Param('oid') oid: number) {
    return await this.service.deleteConciliacion(oid);
  }

  @Get('acta/:id')
  async getActa(@Param('id') id: number, @Res() res: Response) {
    const file = await this.service.getActa(id);
    return res.sendFile(path.join(file));
  }
}
