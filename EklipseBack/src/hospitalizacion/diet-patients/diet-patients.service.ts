import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getConnection, Connection, QueryRunner } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import {
  PatientsRepository,
  DietaCentroRepository,
  DietaGrupoRepository,
  DietaJornadaRepository,
} from './repository';
import { DietaDto } from './dtos';
import { DietaCentro, DietaEstado, DietaGrupo, DietaJornada } from './entity';
import { DietaEstadoRepository } from './repository/gcmHosDieEst.repository';
import { Response } from 'src/common/models';

@Injectable()
export class DietPatientsService {
  public user;
  public idUsuario;
  public gcmHosDieJor;
  public gcmHosDieCen;
  public estado;
  public estados = [];
  private connection: Connection;
  private queryRunner: QueryRunner;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService,
    private readonly patientsRepository: PatientsRepository,
    private readonly dietaCentroRepository: DietaCentroRepository,
    private readonly dietaGrupoRepository: DietaGrupoRepository,
    private readonly dietaJornadaRepository: DietaJornadaRepository,
    private readonly dietaEstadoRepository: DietaEstadoRepository
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.user = authService.payload(token);
      this.connection = getConnection(
        authService.getConnectionWithToken(token)
      );
      this.queryRunner = this.connection.createQueryRunner();
      this.queryRunner.connect();
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getPatients(center): Promise<Response> {
    try {
      const data = await this.patientsRepository.getPatients(center);
      if (!data) {
        return {
          success: false,
          message: 'No hay Pacientes',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Pacientes',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error. ', error.message);
    }
  }

  async getPatientsEvol(adncenate: number, subgroup: string) {
    try {
      const data = await this.patientsRepository.getPatientsEvol(
        adncenate,
        subgroup
      );
      if (!data) {
        return {
          success: false,
          message: 'No hay Pacientes',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Pacientes',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error. ', error.message);
    }
  }

  async getPatientsForDiets(adncenate: number, subgroup: string) {
    try {
      const data = await this.patientsRepository.getPatientsForDiets(
        adncenate,
        subgroup
      );
      if (!data) {
        return {
          success: false,
          message: 'No hay Pacientes',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Pacientes',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error. ', error.message);
    }
  }

  async getdiecen(fechaDieta, adncenate) {
    return await this.dietaCentroRepository.findDietaCentro(
      fechaDieta,
      adncenate
    );
  }

  isjornada(dietaDto?: DietaDto): boolean {
    const time = new Date().getHours() * 60 + new Date().getMinutes();
    switch (dietaDto.dietaJornada) {
      case (dietaDto.dietaJornada = 1):
        return time > 0 && time < 301;
      case (dietaDto.dietaJornada = 2):
        return time > 570 && time < 630;
      case (dietaDto.dietaJornada = 3):
        return time > 900 && time < 945;
      default:
        return false;
    }
  }

  async RegistroFinal(dietaDto: DietaDto) {
    if (this.isjornada(dietaDto)) {
      return await this.registerDieta(dietaDto);
    } else {
      return {
        success: false,
        message: 'Estas Registrando Dieta Fuera del Rango de Horas Habiles',
        data: null,
      };
    }
  }

  async registerDieta(dietaDto: DietaDto): Promise<Response> {
    try {
      const user = await this.user.idUsuario;
      await this.queryRunner.startTransaction();

      const gcmHosDieCen = await this.getGcmHosDieCentro(dietaDto);
      const gcmHosDieJor = await this.getGcmHosDieJornada(
        gcmHosDieCen,
        dietaDto
      );
      const gcmHosDieGru = await this.getGcmHosDieGrupo(gcmHosDieJor, dietaDto);
      //console.log(gcmHosDieCen, gcmHosDieJor, gcmHosDieGru);
      if (gcmHosDieGru == null) {
        return {
          success: false,
          message:
            'Este Subgrupo de Hospitalizacion Ya se encuentra registrado en esta jornada',
          data: gcmHosDieGru,
        };
      }

      dietaDto.pacientes.forEach(async (paciente: any, index) => {
        try {
          this.estado = new DietaEstado();

          this.estado.dietaCentro = this.gcmHosDieCen.oid;
          this.estado.dietaJornada = gcmHosDieJor.id;
          this.estado.dietaGrupo = gcmHosDieGru.id;
          this.estado.adncenate = dietaDto.adncenate;
          this.estado.subgroup = dietaDto.subgroup;
          this.estado.fechaDieta = new Date();
          this.estado.jornada = dietaDto.dietaJornada;
          this.estado.estadoDieta = 1;

          this.estado.estancia = paciente.HPNESTANC;
          this.estado.tipo = paciente.DIEGRUTIP;
          this.estado.consistencia = paciente.DIEGRUCON;
          this.estado.observacion = paciente.DIEGRUOBS;

          this.estado.userRegDieta = user;
          this.estado.fechaRegDieta = new Date();

          this.estados.push(this.estado);
          if (index === dietaDto.pacientes.length - 1) {
            await this.queryRunner.manager.save(DietaEstado, this.estados);

            await this.queryRunner.manager.save(DietaCentro, gcmHosDieCen);

            await this.queryRunner.manager.save(DietaJornada, gcmHosDieJor);

            await this.queryRunner.manager.save(DietaGrupo, gcmHosDieGru);

            await this.queryRunner.commitTransaction();
          }
        } catch (error) {
          throw new BadRequestException(
            'Ocurrio un Error en Dieta',
            error.message
          );
        }
      });
      return {
        success: true,
        message: `El subgrupo de hospitalizacion fue registrado en la jornada de dieta exitosamente`,
        data: this.estados,
      };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw new BadRequestException('Ocurrio un error, ', error.message);
    }
  }

  async getGcmHosDieCentro(dietaDto?: DietaDto): Promise<DietaCentro> {
    const { fechaDieta, adncenate } = dietaDto;
    this.gcmHosDieCen = await this.dietaCentroRepository.findDietaCentro(
      new Date(fechaDieta),
      adncenate
    );
    const lastDieta = await this.dietaCentroRepository.findLastDietaCentro();
    if (this.gcmHosDieCen == null) {
      this.gcmHosDieCen = new DietaCentro();

      this.gcmHosDieCen.oid = lastDieta[0].OID + 1;
      this.gcmHosDieCen.adncenate = adncenate;
      this.gcmHosDieCen.fechaDieta = new Date();
      this.gcmHosDieCen.dietaEstado = 1;
      this.gcmHosDieCen.userRegDieta = this.user.idUsuario;
      this.gcmHosDieCen.fechaRegDieta = new Date();
      return this.queryRunner.manager.create(DietaCentro, this.gcmHosDieCen);
    }
    return this.gcmHosDieCen;
  }

  async getGcmHosDieJornada(
    dietaCentro?: DietaCentro,
    dietaDto?: DietaDto
  ): Promise<DietaJornada> {
    const jornada = new DietaJornada();
    const { dietaJornada } = dietaDto;
    switch (dietaJornada) {
      case jornada.DESAYUNO:
        if (dietaCentro.dietaDesayuno == null) {
          const gcmHosDieJor = await this.registrarJornadaDieta(
            dietaCentro,
            dietaDto
          );
          dietaCentro.dietaDesayuno = gcmHosDieJor.id;
          return gcmHosDieJor;
        } else {
          const gcmHosDieJor = await this.queryRunner.manager
            .getRepository(DietaJornada)
            .findOne({
              dietaCentro: dietaCentro.oid,
              id: dietaCentro.dietaDesayuno,
            });
          return gcmHosDieJor;
        }
        break;
      case jornada.ALMUERZO:
        if (dietaCentro.dietaAlmuerzo == null) {
          const gcmHosDieJor = await this.registrarJornadaDieta(
            dietaCentro,
            dietaDto
          );
          dietaCentro.dietaAlmuerzo = gcmHosDieJor.id;
          return gcmHosDieJor;
        } else {
          const gcmHosDieJor = await this.queryRunner.manager
            .getRepository(DietaJornada)
            .findOne({
              dietaCentro: dietaCentro.oid,
              id: dietaCentro.dietaAlmuerzo,
            });
          return gcmHosDieJor;
        }
        break;

      case jornada.CENA:
        if (dietaCentro.dietaCena == null) {
          const gcmHosDieJor = await this.registrarJornadaDieta(
            dietaCentro,
            dietaDto
          );
          dietaCentro.dietaCena = gcmHosDieJor.id;
          return gcmHosDieJor;
        } else {
          const gcmHosDieJor = await this.queryRunner.manager
            .getRepository(DietaJornada)
            .findOne({
              dietaCentro: dietaCentro.oid,
              id: dietaCentro.dietaCena,
            });
          return gcmHosDieJor;
        }
        break;
    }
  }

  async registrarJornadaDieta(dietaCentro?: DietaCentro, dietaDto?: DietaDto) {
    const lastDietaJornada =
      await this.dietaCentroRepository.findLastDietaJornada();
    const _dieta = new DietaJornada();

    _dieta.id = lastDietaJornada[0].OID + 1;
    _dieta.dietaCentro = dietaCentro.oid;
    _dieta.adncenate = dietaDto.adncenate;
    _dieta.fechaDieta = new Date();
    _dieta.dietaJornada = dietaDto.dietaJornada;
    _dieta.dietaEstado = 1;
    _dieta.userRegDieta = this.user.idUsuario;
    _dieta.fechaRegDieta = new Date();

    return this.queryRunner.manager.create(DietaJornada, _dieta);
  }

  async getGcmHosDieGrupo(
    dietaJor?: DietaJornada,
    dietaDto?: DietaDto
  ): Promise<DietaGrupo> {
    const { id } = dietaJor;
    const { subgroup } = dietaDto;
    const lastDietaGrupo =
      await this.dietaCentroRepository.findLastDietaGrupo();
    const gcmHosDieGrupo = await this.dietaGrupoRepository.findDietaGrupo(
      id,
      subgroup
    );
    if (gcmHosDieGrupo == null) {
      const grupo = new DietaGrupo();

      grupo.id = lastDietaGrupo[0].OID + 1;
      grupo.dietaCentro = dietaJor.dietaCentro;
      grupo.dietaJornada = dietaJor.id;
      grupo.adncenate = dietaDto.adncenate;
      grupo.subgroup = dietaDto.subgroup;
      grupo.jornada = dietaDto.dietaJornada;
      grupo.fechaDieta = new Date();
      grupo.estadoDieta = 1;
      grupo.userRegDieta = this.user.idUsuario;
      grupo.fechaRegDieta = new Date();

      return this.queryRunner.manager.create(DietaGrupo, grupo);
    } else {
      return null;
    }
  }

  async getDietaJornada(fechaDieta: Date): Promise<Response> {
    try {
      const count = await this.dietaJornadaRepository.countDietaJornada(
        fechaDieta
      );
      const totalJornada = await this.dietaJornadaRepository.totalJornada(
        fechaDieta
      );
      const dietas = await this.dietaJornadaRepository.findDietaJornada(
        fechaDieta
      );
      const data = { dietas, count, totalJornada };
      if (!data) {
        return {
          success: false,
          message: 'No hay Dietas Para Mostrar.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Dietas de la Jornada.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un erro al obtener las jornadas ',
        error.message
      );
    }
  }

  async getDietaEstado(jornada): Promise<Response> {
    try {
      const combinaciones = await this.dietaEstadoRepository.getCombinaciones(
        jornada
      );
      const pacientes = await this.dietaEstadoRepository.getDietaEstado(
        jornada
      );
      const consistencias = await this.dietaEstadoRepository.getConsistencia(
        jornada
      );
      const data = { combinaciones, pacientes, consistencias };
      if (!data) {
        return {
          success: false,
          message: 'No hay Dietas Para Mostrar.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Dietas de la Jornada.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error.', error.message);
    }
  }

  //este no es el de arribas
  async getTotalJornada(jornada): Promise<Response> {
    try {
      const data = await this.dietaEstadoRepository.getTotalJornada(jornada);
      if (!data) {
        return {
          success: false,
          message: 'No hay Dietas Para Mostrar.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Dietas de la Jornada.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error.', error.message);
    }
  }

  async confirmacionEntrega(jornada: number): Promise<Response> {
    try {
      const data = await this.dietaEstadoRepository.confirmacionEntrega(
        jornada
      );
      if (!data) {
        return {
          success: false,
          message: 'No hay Dietas En Esta Jornada.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Dietas de la Jornada.',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async facturacionGeneral(
    fechaInicio: string,
    fechaFinal: string
  ): Promise<Response> {
    try {
      const data = await this.dietaEstadoRepository.facturacionGeneral(
        fechaInicio,
        fechaFinal
      );
      if (!data) {
        return {
          success: false,
          message: 'No hay Dietas En Este Rango de Fechas.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Dietas del Rango de Fechas',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un error', error.message);
    }
  }

  async facturacionPorCentro(fecha: string, centro: string): Promise<Response> {
    try {
      const data = await this.dietaEstadoRepository.facturacionPorCentro(
        fecha,
        centro
      );
      if (!data) {
        return {
          success: false,
          message: 'No hay Dietas En Esta Fecha.',
          data,
        };
      } else {
        return {
          success: true,
          message: 'Dietas del Rango de Fechas',
          data,
        };
      }
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async getCombinaciones(jornada) {
    try {
      return await this.dietaEstadoRepository.getCombinaciones(jornada);
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un Error al Obtener las combinaciones',
        error.message
      );
    }
  }

  async get_consistencia(jornada) {
    try {
      return await this.dietaEstadoRepository.getConsistencia(jornada);
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un Error al Obtener las consistencias',
        error.message
      );
    }
  }
}
