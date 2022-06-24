import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric, ApiPropIsDate } from "src/application/services/swagger.service";

export class GetRadicacionPorContratoDto {
  @IsString({ message: "el campo 'contrato' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'contrato' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  contrato: string;

  @IsString({ message: "el campo 'inicioReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'inicioReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  inicioReporte: string;

  @IsString({ message: "el campo 'finalReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'finalReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  finalReporte: string;
}
