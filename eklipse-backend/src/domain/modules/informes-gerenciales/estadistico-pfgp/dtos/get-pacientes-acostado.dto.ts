import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric, ApiPropIsString } from "src/application/services/swagger.service";

export class GetPacientesAcostadoDto {
  @IsString({ message: "el campo 'antiguedad' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'antiguedad' es requerido" })
  @ApiProperty(ApiPropIsString())
  antiguedad: string;

  @IsString({ message: "el campo 'centro1' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'centro1' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  centro1: string;

  @IsString({ message: "el campo 'centro2' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'centro2' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  centro2: string;

  @IsString({ message: "el campo 'contrato' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'contrato' es requerido" })
  @ApiProperty(ApiPropIsString())
  contrato: string;
}
