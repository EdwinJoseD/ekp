import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnumToString } from 'src/common/helpers';
import { Connection } from '../enums';

export class AuthDto {
  @IsString()
  @ApiProperty({ description: 'Identificación del Usuario' })
  identification: string;

  @IsString()
  @ApiProperty({ description: 'Contraseña de Dinamica' })
  password: string;

  @IsNotEmpty()
  @IsEnum(Connection, {
    message: `Opcion invalida. Las opciones validas son ${EnumToString(
      Connection
    )}`,
  })
  @ApiProperty({ description: 'Conexion' })
  connection: string;
}
