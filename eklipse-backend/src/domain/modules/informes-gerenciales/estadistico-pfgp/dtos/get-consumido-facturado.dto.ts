import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsDate, ApiPropIsNumeric } from "src/application/services/swagger.service";

export class GetConsumidoFacturadoDto {
  @IsString({ message: "el campo 'inicioReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'inicioReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  inicioReporte: string;

  @IsString({ message: "el campo 'finalReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'finalReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  finalReporte: string;

  @IsString({ message: "el campo 'centro1' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'centro1' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  centro1: string;

  @IsString({ message: "el campo 'centro2' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'centro2' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  centro2: string;
}
