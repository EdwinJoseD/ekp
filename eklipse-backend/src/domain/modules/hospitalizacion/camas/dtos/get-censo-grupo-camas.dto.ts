import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsString } from "src/application/services/swagger.service";

export class GetCensoGrupocamasDto {
  @IsString({ message: "el campo 'grupo' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'grupo' es requerido" })
  @ApiProperty(ApiPropIsString())
  grupo: string;
}
