import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager, QueryRunner } from 'typeorm';
import { Request } from 'express';
import { GestionCarteraDto } from '../dto/gestion.dto';
import { GestionCarteraEntity } from '../entity';
import { ConciliacionCarteraEntity } from 'src/cartera/conciliacion/entity';
import { ConciliacionRepository } from 'src/cartera/conciliacion/repository';
import { AllowUsers } from '../../AllowUser';

@Injectable()
export class GestionRepository {
  private gestionRepository: Connection;
  private user: any;
  private conexion: string;
  private queryRunner: QueryRunner;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService,
    private readonly RepoConciliacion: ConciliacionRepository
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.user = authService.payload(token);
      //{ idUsuario: 4148, connection: 'ALTA-CENTRO' }
      this.gestionRepository = getManager(this.conexion).connection;
      this.queryRunner = this.gestionRepository.createQueryRunner();
      this.queryRunner.connect();
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO', error.message);
    }
  }

  async getTercero(nit: string) {
    return await this.queryRunner.query(
      `
        SELECT 
        OID, 
        TERNUMDOC, 
        TERNOMCOM 
        FROM GENTERCER 
        WHERE TERACTINAC = 1 
        AND TERNUMDOC = @0
    `,
      [nit]
    );
  }

  async getGestions() {
    if (AllowUsers.includes(this.user.idUsuario)) {
      return await this.queryRunner.query(
        `SELECT 
        G.OID,
        G.GENUSUARIO OIDGENUSUARIO,
        U.USUDESCRI GENUSUARIO,
        G.FECHA,
        G.GENTERCER OIDGENTERCER,
        T.TERNOMCOM GENTERCER,
        G.TELEFTERC,
        G.RESPTERC,
        G.MOTLLAMAD,
        G.OBSERVACION,
        G.FECHCONCI,
        G.TIPCONCI
        FROM GCMGESCART G
        INNER JOIN GENUSUARIO U  ON U.OID = G.GENUSUARIO
        INNER JOIN GENTERCER T ON T.OID = G.GENTERCER
        ORDER BY G.FECHA DESC`
      );
    } else {
      return await this.queryRunner.query(
        `SELECT 
        G.OID,
        G.GENUSUARIO OIDGENUSUARIO,
        U.USUDESCRI GENUSUARIO,
        G.FECHA,
        G.GENTERCER OIDGENTERCER,
        T.TERNOMCOM GENTERCER,
        G.TELEFTERC,
        G.RESPTERC,
        G.MOTLLAMAD,
        G.OBSERVACION,
        G.FECHCONCI,
        G.TIPCONCI
        FROM GCMGESCART G
        INNER JOIN GENUSUARIO U  ON U.OID = G.GENUSUARIO
        INNER JOIN GENTERCER T ON T.OID = G.GENTERCER
        WHERE G.GENUSUARIO = @0
        ORDER BY G.FECHA DESC`,
        [this.user.idUsuario]
      );
    }
  }

  async addGestion(gestion: GestionCarteraDto) {
    try {
      await this.queryRunner.startTransaction();
      const gestionCartera: GestionCarteraEntity = await this.Map(gestion);
      const createdGestion = this.queryRunner.manager.create(
        GestionCarteraEntity,
        gestionCartera
      );
      await this.queryRunner.manager.save(GestionCarteraEntity, createdGestion);

      if (gestion.FECHCONCI !== null) {
        const lastGestion = await this.queryRunner.manager.find(
          GestionCarteraEntity,
          {
            order: {
              OID: 'DESC',
            },
            take: 1,
          }
        );
        const cretaedConciliacion = await this.addConciliacion(
          lastGestion[0],
          'insert'
        );
        await this.queryRunner.manager.save(
          ConciliacionCarteraEntity,
          cretaedConciliacion
        );
      }
      await this.queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Gestion creada con exito',
      };
    } catch (error) {
      console.log(error.message);
      await this.queryRunner.rollbackTransaction();
      return {
        success: false,
        message: 'Error al Crear la Gestion',
      };
    }
  }

  async updateGestion(oid: number, gestion: GestionCarteraDto) {
    try {
      await this.queryRunner.startTransaction();
      const findGestion = await this.queryRunner.manager.findOne(
        GestionCarteraEntity,
        oid
      );
      const updatedGestion = Object.assign(findGestion, gestion);
      await this.queryRunner.manager.save(GestionCarteraEntity, updatedGestion);
      if (updatedGestion.FECHCONCI !== null) {
        await this.addConciliacion(updatedGestion, 'update');
      }
      await this.queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Gestion actualizada con exito',
      };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      return { success: false, message: 'Error al actualizar la Gestion' };
    }
  }

  async deleteGestion(oid: number) {
    try {
      await this.queryRunner.startTransaction();
      const findGestion = await this.queryRunner.manager.findOne(
        GestionCarteraEntity,
        oid
      );
      if (!findGestion) {
        return { success: false, message: 'La Gestion no existe' };
      }
      const conciliacion = await this.RepoConciliacion.getConciliacionByGestion(
        findGestion.OID
      );
      if (conciliacion) {
        return {
          success: false,
          message:
            'No se puede eliminar la gestion por que tiene una conciliacion abierta',
        };
      } else {
        await this.queryRunner.manager.remove(
          GestionCarteraEntity,
          findGestion
        );
        await this.queryRunner.commitTransaction();
        return {
          success: true,
          message: 'Gestion eliminada con exito',
        };
      }
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      return { success: false, message: 'Error al eliminar la Gestion' };
    }
  }

  async addConciliacion(
    gestion: GestionCarteraEntity,
    action: string
  ): Promise<ConciliacionCarteraEntity> {
    const conciliacion = new ConciliacionCarteraEntity();
    if (action === 'insert') {
      conciliacion.GCMGESCART = gestion.OID;
      conciliacion.FECHACONC = new Date(gestion.FECHCONCI);
      return this.queryRunner.manager.create(
        ConciliacionCarteraEntity,
        conciliacion
      );
    }
    if (action === 'update') {
      const findConciliacion = await this.queryRunner.manager.findOne(
        ConciliacionCarteraEntity,
        gestion.OID
      );
      findConciliacion.FECHACONC = new Date(gestion.FECHCONCI);
      return this.queryRunner.manager.save(
        ConciliacionCarteraEntity,
        findConciliacion
      );
    }
  }

  async Map(gestionDto: GestionCarteraDto): Promise<GestionCarteraEntity> {
    const gestion = new GestionCarteraEntity();
    gestion.FECHA = new Date(gestionDto.FECHA);
    gestion.GENUSUARIO = gestionDto.GENUSUARIO;
    gestion.GENTERCER = gestionDto.GENTERCER;
    gestion.TELEFTERC = gestionDto.TELEFTERC;
    gestion.RESPTERC = gestionDto.RESPTERC;
    gestion.MOTLLAMAD = gestionDto.MOTLLAMAD;
    gestion.OBSERVACION = gestionDto.OBSERVACION;
    gestion.FECHCONCI = gestionDto.FECHCONCI;
    gestion.TIPCONCI = gestionDto.TIPCONCI;
    return gestion;
  }
}
