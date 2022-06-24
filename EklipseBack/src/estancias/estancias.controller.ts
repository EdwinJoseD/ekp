import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { EstanciasService } from './estancias.service';

@Auth()
@ApiTags('Estancias')
@Controller('estancias')
export class EstanciasController {
  constructor(private readonly servicio: EstanciasService) {}

  @Get()
  async traer_paciente_acostados() {
    try {
      const data = await this.servicio.traer_paciente_acostados();
      if (data.length > 0) {
        return {
          success: true,
          data,
          message: 'Censo Hospitalario',
        };
      } else {
        return {
          success: false,
          data,
          message: 'No hay datos',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }
}
