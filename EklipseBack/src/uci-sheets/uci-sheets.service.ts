import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'src/common/models';
import { UciSheetsRepository } from './repository';

@Injectable()
export class UciSheetsService {
  constructor(private readonly repository: UciSheetsRepository) {}

  async getUciSheets(adnIngreso: string, fecha: Date) {
    try {
      //Liquidos
      const liq = await this.repository.liquidos(adnIngreso, fecha);
      const liquidosGrupo = liq.reduce((h, obj) => {
        h[obj.LIQUIDO] = (h[obj.LIQUIDO] || []).concat(obj);
        return h;
      }, {});
      //Glucometria
      const glucometria = await this.repository.glucometria(adnIngreso, fecha);

      //Signos Vitales
      const sV = await this.repository.signosVitales(adnIngreso, fecha);
      const signosVitales = sV.reduce((h, obj) => {
        h[obj.SIGNO] = (h[obj.SIGNO] || []).concat(obj);
        return h;
      }, {});

      delete signosVitales.null;
      const signos = [];
      for (const signo in signosVitales) {
        const signosa = { signo, resultados: signosVitales[signo] };
        signos.push(signosa);
      }
      delete liquidosGrupo.null;
      const liquidos = [];
      for (const liquido in liquidosGrupo) {
        const liquid = { liquido, resultado: liquidosGrupo[liquido] };
        liquidos.push(liquid);
      }

      //*Informacion Paciente
      const infoIngreso = await this.repository.infoIngreso(adnIngreso, fecha);

      const balanceLiquidos = await this.repository.balancesLiquidos(
        fecha,
        adnIngreso
      );

      const data = {
        infoIngreso,
        liquidos,
        signos,
        glucometria,
        balanceLiquidos,
      };
      return {
        success: true,
        message: 'Sabanas UCI',
        data,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(
        'Por favor revise los datos ingresados',
        error.message
      );
    }
  }

  async getUciSheet(ingreso: string, fechaInicio: Date, fechaFinal: Date) {
    try {
      const data = [];
      const fechas = [];
      while (fechaInicio <= fechaFinal) {
        const mili = 24 * 60 * 60 * 1000;
        const mañana = new Date(fechaInicio.getTime() + mili);
        fechas.push(fechaInicio);
        fechaInicio = mañana;
      }
      for (let i = 0; i < fechas.length; i++) {
        const datos = await this.getUciSheets(ingreso, fechas[i]);
        data.push(datos.data);
      }
      if (data.length > 0) {
        return {
          success: true,
          message: 'Datos Para Generar Sabanas de Radicacion',
          data,
        };
      } else {
        return {
          success: false,
          message: 'No Hay Informacion Para Generar La Sabana',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'Error al Consultar la informacion para crear las sabanas, ',
        error.message
      );
    }
  }

  async getHpnestancia(adnIngreso: string): Promise<Response> {
    try {
      const data = await this.repository.getHpnestancia(adnIngreso);
      if (!data) {
        return {
          success: false,
          message: 'No hay Estancias',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Estancia Paciente',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }

  async PacientesSinPeso(): Promise<Response> {
    try {
      const data = await this.repository.pacientesSinPeso();
      if (!data) {
        return {
          success: false,
          message: 'No hay Pacientes',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Lista de Pacientes',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error ', error.message);
    }
  }
}
