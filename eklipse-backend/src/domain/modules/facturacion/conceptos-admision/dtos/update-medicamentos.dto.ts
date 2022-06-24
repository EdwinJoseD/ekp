import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateMedicamentosDto {
  @IsArray({ message: "el campo 'medicamentos' debe ser  de tipo number[]" })
  @IsNotEmpty({ message: "el campo 'medicamentos' es requerido" })
  @ApiProperty({ type: [], example: [1, 2, 3, 4] })
  medicamentos: number[];

  @IsNumber()
  @IsNotEmpty({ message: "el campo 'conceptoFacturacion' es requerido" })
  @ApiProperty({ type: Number, example: 13 })
  conceptoFacturacion: number;
}
