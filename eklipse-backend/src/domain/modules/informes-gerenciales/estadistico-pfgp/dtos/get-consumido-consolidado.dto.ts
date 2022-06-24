import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsDate } from "src/application/services/swagger.service";

export class GetConsumidoConsolidadoDto {
  @IsString({ message: "el campo 'inicioReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'inicioReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  inicioReporte: string;

  @IsString({ message: "el campo 'finalReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'finalReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  finalReporte: string;
}
