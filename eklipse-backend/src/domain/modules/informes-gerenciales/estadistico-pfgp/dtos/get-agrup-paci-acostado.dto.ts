import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsString } from "src/application/services/swagger.service";

export class GetAgrupPaciAcostadoDto {
  @IsString({ message: "el campo 'contrato' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'contrato' es requerido" })
  @ApiProperty(ApiPropIsString())
  contrato: string;

  @IsString({ message: "el campo 'ingreso' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'ingreso' es requerido" })
  @ApiProperty(ApiPropIsString())
  ingreso: string;
}
