import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsNumeric, ApiPropIsString } from "src/application/services/swagger.service";

export class GetMedicamentosDto {
  @IsString({ message: "el campo 'ingreso' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'ingreso' es requerido" })
  @ApiProperty(ApiPropIsNumeric())
  ingreso: string;

  @IsString({ message: "el campo 'conceptoFacturacion' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'conceptoFacturacion' es requerido" })
  @ApiProperty(ApiPropIsString())
  conceptoFacturacion: string;
}
