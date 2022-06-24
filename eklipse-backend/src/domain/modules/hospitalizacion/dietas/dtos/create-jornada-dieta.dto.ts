import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNumber } from "class-validator";
import { ApiPropIsArray } from "src/application/services/swagger.service";
import { PacienteRegDieI } from "src/domain/modules/hospitalizacion/dietas/interfaces/paciente-regdie.interface";

export class CreateJornadaDietaDto {
  @IsDateString()
  @ApiProperty({ type: Date, example: "2022-01-31" })
  fechaRegistro: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 96 })
  jornadaDieta: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 12 })
  centroAtencion: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 25 })
  subgrupoCama: number;

  @IsArray()
  @ApiProperty({ type: [], example: ["PacienteRegDie1", "PacienteRegDie2"] })
  pacientes: PacienteRegDieI[];
}
