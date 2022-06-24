import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric } from "src/application/services/swagger.service";

export class GetEstanciasPacienteDto {
  @IsString({ message: "el campo 'ingreso' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'ingreso' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  ingreso: string;
}
