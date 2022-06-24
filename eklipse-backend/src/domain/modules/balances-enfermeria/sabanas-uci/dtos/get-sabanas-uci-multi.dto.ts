import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsDate, ApiPropIsNumeric } from "src/application/services/swagger.service";

export class GetSabanasUCiMultiDto {
  @IsString({ message: "el campo 'ingreso' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'ingreso' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  ingreso: string;

  @IsString({ message: "el campo 'inicioReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'inicioReporte' es requerido" })
  @ApiProperty({ type: Date })
  @ApiProperty(ApiPropIsDate())
  inicioReporte: string;

  @IsString({ message: "el campo 'finalReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'finalReporte' es requerido" })
  @ApiProperty({ type: Date })
  @ApiProperty(ApiPropIsDate())
  finalReporte: string;
}
