import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsDate } from "src/application/services/swagger.service";

export class GetDietaJornadaDto {
  @IsString({ message: "el campo 'fecha' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'fecha' es requerido" })
  @ApiProperty(ApiPropIsDate())
  fecha: string;
}
