import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { ConciliacionService } from "./conciliacion.service";
import { ConciliacionCarteraDto } from "./dto/conciliacion.dto";
import { Response } from "express";
import * as path from "path";
import { Auth } from "src/application/decorators/auth.decorator";
import { editFileName, pdfFileFilter } from "src/application/helpers";

@Auth()
@ApiTags("cartera/Conciliacion")
@Controller("conciliacion")
export class ConciliacionController {
  constructor(private readonly service: ConciliacionService) {}

  @Get()
  async getConciliaciones() {
    return await this.service.getConciliaciones();
  }

  @Put(":id")
  async updateConciliacion(@Param("id") id: number, @Body() conciliacion: ConciliacionCarteraDto) {
    return await this.service.updateConciliacion(id, conciliacion);
  }

  @Put("acta/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/actas",
        filename: editFileName,
      }),
      fileFilter: pdfFileFilter,
    })
  )
  async uploadfile(@Param("id") id: number, @UploadedFile() pdf: Express.Multer.File) {
    return await this.service.updateActa(id, pdf.path);
  }

  @Delete(":id")
  async deleteConciliacion(@Param("id") id: number) {
    return await this.service.deleteConciliacion(id);
  }

  @Get("acta/:id")
  async getActa(@Param("id") id: number, @Res() res: Response) {
    const file = await this.service.getActa(id);
    return res.sendFile(path.join(file));
  }
}
