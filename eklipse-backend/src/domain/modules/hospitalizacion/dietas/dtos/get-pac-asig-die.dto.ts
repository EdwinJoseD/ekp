import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric, ApiPropIsString } from "src/application/services/swagger.service";

export class GetPacPorAsignarDietaDto {
  @IsString({ message: "el campo 'centroAtencion' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'centroAtencion' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  centroAtencion: string;

  @IsString({ message: "el campo 'subgrupo' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'subgrupo' es requerido" })
  @ApiProperty(ApiPropIsString())
  subgrupo: string;
}
