import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiPropIsString } from "src/application/services/swagger.service";

export class LoginDto {
  @IsString({ message: "el campo 'identification' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'identification' es requerido" })
  @ApiProperty(ApiPropIsString())
  identification: string;

  @IsString({ message: "el campo 'password' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'password' es requerido" })
  @ApiProperty(ApiPropIsString())
  password: string;

  @IsString({ message: "el campo 'context' debe ser de tipo string" })
  @IsNotEmpty({ message: "el campo 'context' es requerido" })
  @ApiProperty(ApiPropIsString())
  context: string;
}
