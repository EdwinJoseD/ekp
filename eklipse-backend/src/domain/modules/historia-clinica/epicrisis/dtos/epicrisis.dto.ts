import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric } from "src/application/services/swagger.service";

export class EpicrisisDto {
  @IsString({ message: "el campo 'consecutivo' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'consecutivo' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  consecutivo: string;
}
