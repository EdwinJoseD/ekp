import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric } from "src/application/services/swagger.service";

export class GetSubgruposCamasDto {
  @IsString({ message: "el campo 'centroAtencion' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'centroAtencion' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  centroAtencion: string;
}
