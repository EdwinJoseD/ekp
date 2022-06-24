import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import {
  ApiPropIsDate,
  ApiPropIsNumeric,
  ApiPropIsString,
} from "src/application/services/swagger.service";

export class GetPacientesAgrupadorDto {
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

  @IsString({ message: "el campo 'contrato1' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'contrato1' es requerido" })
  @ApiProperty(ApiPropIsString())
  contrato1: string;

  @IsString({ message: "el campo 'contrato2' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'contrato2' es requerido" })
  @ApiProperty(ApiPropIsString())
  contrato2: string;

  @IsString({ message: "el campo 'agrupador' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'agrupador' es requerido" })
  @ApiProperty(ApiPropIsString())
  agrupador: string;
}
