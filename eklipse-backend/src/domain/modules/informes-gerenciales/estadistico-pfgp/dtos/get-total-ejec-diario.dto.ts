import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsDate, ApiPropIsString } from "src/application/services/swagger.service";

export class GetTotalEjecDiarioDto {
  @IsString({ message: "el campo 'inicioReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'inicioReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  inicioReporte: string;

  @IsString({ message: "el campo 'finalReporte' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'finalReporte' es requerido" })
  @ApiProperty(ApiPropIsDate())
  finalReporte: string;

  @IsString({ message: "el campo 'contrato' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'contrato' es requerido" })
  @ApiProperty(ApiPropIsString())
  contrato: string;
}
