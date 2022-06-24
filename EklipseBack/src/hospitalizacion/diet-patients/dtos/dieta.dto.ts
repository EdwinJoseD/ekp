import { IsNumber, IsArray, IsDateString } from 'class-validator';

export class DietaDto {
  @IsDateString()
  fechaDieta: string;

  @IsNumber()
  dietaJornada: number;

  @IsNumber()
  adncenate: number;

  @IsNumber()
  subgroup: number;

  @IsArray()
  pacientes: any[];
}
