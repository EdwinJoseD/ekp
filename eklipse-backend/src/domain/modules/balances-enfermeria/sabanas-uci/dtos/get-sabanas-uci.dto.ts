import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsDate, ApiPropIsNumeric } from "src/application/services/swagger.service";

export class GetSabanasUCiDto {
  @IsString({ message: "el campo 'ingreso' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'ingreso' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  ingreso: string;

  @IsString({ message: "el campo 'fecha' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'fecha' es requerido" })
  @ApiProperty(ApiPropIsDate())
  fecha: string;
}
