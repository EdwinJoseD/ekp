import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric } from "src/application/services/swagger.service";

export class GetDietaEstadoDto {
  @IsString({ message: "el campo 'jornadaDieta' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'jornadaDieta' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  jornadaDieta: string;
}
