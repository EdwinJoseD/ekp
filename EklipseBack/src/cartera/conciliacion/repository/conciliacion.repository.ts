import { Inject, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, getManager, QueryRunner } from 'typeorm';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ConciliacionCarteraEntity } from '../entity';
import { ConciliacionCarteraDto } from '../dto';
import { AllowUsers } from '../../AllowUser';
import * as fs from 'fs';

export class ConciliacionRepository {
  private readonly conexion: string;
  private user: any;
  private readonly repository: Connection;
  private readonly queryRunner: QueryRunner;

  constructor(@Inject(REQUEST) request: Request, authService: AuthService) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.user = authService.payload(token);
      this.repository = getManager(this.conexion).connection;
      this.queryRunner = this.repository.createQueryRunner();
      this.queryRunner.connect();
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO', error.message);
    }
  }

  async getConciliaciones() {
    if (AllowUsers.includes(this.user.idUsuario)) {
      return await this.queryRunner.manager.query(`
      SELECT 
      GGC.FECHA FechaGestion,
      GGC.OID IdGestion,
      GU.OID IdUsuario,
      GU.USUNOMBRE Identificacion,
      GU.USUDESCRI UsuarioEncargado,
      GT.OID IdTercero,
      GT.TERNUMDOC Nit,
      GT.TERNOMCOM Tercero,
      GCC.OID IdConciliacion,
      GCC.NACTACONCI NActaConciliacion,
      GCC.FECHACONC FechaConciliacion,
      GDF.CalendarYear Anio,
      GDF.CalendarQuarterOfYear Trimestre,
      GDF.MonthNumberOfYear Mes,
      DATEDIFF(DAY, GDF.DATE, GETDATE()) Dias,
      GCC.VALCONCI ValorConciliado,
      GCC.VALRECPAG ValorReconocidoParaPago,
      GCC.VALGLOSAD ValorGlosado,
      GCC.VALDEVUEL ValorDevuelto,
      GCC.VALNORADI ValorNoRadicado,
      GCC.AUDITORIA ValorEnAuditoria,
      GCC.RETENCION ValorEnRetencion,
      GCC.GLOSACEPTIPS ValorDeGlosasAceptadaPorIPS,
      GCC.NOTNODESCEPS ValorNoDescontadoPorEps,
      GCC.PAGNOAPLI ValorPagoNoAplicado,
      GCC.COPCUOMODE ValorCuotaModeradora,
      GCC.VALCANCEL ValorCancelado,
      GCC.TOTAL ValorTotal,
      GCC.DIFEREN ValorDiferencia,
      GCC.RUTARCHI RutaArchivo,
      GCC.ESTADO Estado
      FROM GCMCONCCART GCC
      INNER JOIN GCMGESCART GGC ON GCC.GCMGESCART = GGC.OID
      INNER JOIN GCMDIMFECHA GDF ON CONVERT(DATE, GGC.FECHCONCI, 103) = GDF.Date
      INNER JOIN GENUSUARIO GU ON GGC.GENUSUARIO = GU.OID
      INNER JOIN GENTERCER GT ON GGC.GENTERCER = GT.OID
      `);
    } else {
      return await this.queryRunner.manager.query(
        `
      SELECT 
      GGC.FECHA FechaGestion,
      GGC.OID IdGestion,
      GU.OID IdUsuario,
      GU.USUNOMBRE Identificacion,
      GU.USUDESCRI UsuarioEncargado,
      GT.OID IdTercero,
      GT.TERNUMDOC Nit,
      GT.TERNOMCOM Tercero,
      GCC.OID IdConciliacion,
      GCC.NACTACONCI NActaConciliacion,
      GCC.FECHACONC FechaConciliacion,
      GDF.CalendarYear Anio,
      GDF.CalendarQuarterOfYear Trimestre,
      GDF.MonthNumberOfYear Mes,
      DATEDIFF(DAY, GDF.DATE, GETDATE()) Dias,
      GCC.VALCONCI ValorConciliado,
      GCC.VALRECPAG ValorReconocidoParaPago,
      GCC.VALGLOSAD ValorGlosado,
      GCC.VALDEVUEL ValorDevuelto,
      GCC.VALNORADI ValorNoRadicado,
      GCC.AUDITORIA ValorEnAuditoria,
      GCC.RETENCION ValorEnRetencion,
      GCC.GLOSACEPTIPS ValorDeGlosasAceptadaPorIPS,
      GCC.NOTNODESCEPS ValorNoDescontadoPorEps,
      GCC.PAGNOAPLI ValorPagoNoAplicado,
      GCC.COPCUOMODE ValorCuotaModeradora,
      GCC.VALCANCEL ValorCancelado,
      GCC.TOTAL ValorTotal,
      GCC.DIFEREN ValorDiferencia,
      GCC.RUTARCHI RutaArchivo,
      GCC.ESTADO Estado
      FROM GCMCONCCART GCC
      INNER JOIN GCMGESCART GGC ON GCC.GCMGESCART = GGC.OID
      INNER JOIN GCMDIMFECHA GDF ON CONVERT(DATE, GGC.FECHCONCI, 103) = GDF.Date
      INNER JOIN GENUSUARIO GU ON GGC.GENUSUARIO = GU.OID
      INNER JOIN GENTERCER GT ON GGC.GENTERCER = GT.OID
      WHERE GU.OID = @0
      `,
        [this.user.idUsuario]
      );
    }
  }

  async getConciliacionByGestion(oid: number) {
    try {
      const conciliacion = await this.queryRunner.manager.findOne(
        ConciliacionCarteraEntity,
        { where: { GCMGESCART: oid } }
      );
      return conciliacion;
    } catch (error) {
      return null;
    }
  }

  async updateConciliacion(id: number, _conciliacion: ConciliacionCarteraDto) {
    try {
      await this.queryRunner.startTransaction();
      const conciliacion = await this.queryRunner.manager.findOne(
        ConciliacionCarteraEntity,
        id
      );
      const newConciliacion = this.Map(_conciliacion);
      const updatedConciliacion = Object.assign(conciliacion, newConciliacion);
      await this.queryRunner.manager.save(
        ConciliacionCarteraEntity,
        updatedConciliacion
      );
      await this.queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Conciliacion actualizada',
      };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      return { success: false, message: 'Error al actualizar la conciliacion' };
    }
  }

  async updateActa(OID: number, namefile: string) {
    try {
      await this.queryRunner.startTransaction();
      const conciliacion = await this.queryRunner.manager.findOne(
        ConciliacionCarteraEntity,
        OID
      );
      if (conciliacion.RUTARCHI != null) {
        this.borrararchivo(conciliacion.RUTARCHI);
      }
      const updatedConciliacion = Object.assign(conciliacion, {
        RUTARCHI: namefile,
      });
      await this.queryRunner.manager.save(
        ConciliacionCarteraEntity,
        updatedConciliacion
      );
      await this.queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Acta Cargada',
      };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      return { success: false, message: 'Error al cargar el Acta' };
    }
  }

  async deleteConciliacion(OID: number) {
    try {
      await this.queryRunner.startTransaction();
      const conciliacion = await this.queryRunner.manager.findOne(
        ConciliacionCarteraEntity,
        OID
      );
      if (!conciliacion) {
        return { success: false, message: 'No existe la conciliacion' };
      }
      await this.queryRunner.manager.remove(conciliacion);
      await this.queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Conciliacion eliminada',
      };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      return { success: false, message: 'Error al eliminar la conciliacion' };
    }
  }

  Map(newConciliacion: ConciliacionCarteraDto) {
    const conciliacion = new ConciliacionCarteraEntity();
    conciliacion.NACTACONCI = newConciliacion.NACTACONCI;
    conciliacion.FECHACONC = newConciliacion.FECHACONC;
    conciliacion.VALCONCI = newConciliacion.VALCONCI;
    conciliacion.VALRECPAG = newConciliacion.VALRECPAG;
    conciliacion.VALGLOSAD = newConciliacion.VALGLOSAD;
    conciliacion.VALDEVUEL = newConciliacion.VALDEVUEL;
    conciliacion.VALNORADI = newConciliacion.VALNORADI;
    conciliacion.AUDITORIA = newConciliacion.AUDITORIA;
    conciliacion.RETENCION = newConciliacion.RETENCION;
    conciliacion.GLOSACEPTIPS = newConciliacion.GLOSACEPTIPS;
    conciliacion.NOTNODESCEPS = newConciliacion.NOTNODESCEPS;
    conciliacion.PAGNOAPLI = newConciliacion.PAGNOAPLI;
    conciliacion.COPCUOMODE = newConciliacion.COPCUOMODE;
    conciliacion.VALCANCEL = newConciliacion.VALCANCEL;
    conciliacion.TOTAL = this.total(newConciliacion);
    conciliacion.DIFEREN = this.diferencia(newConciliacion);
    conciliacion.ESTADO = newConciliacion.ESTADO;
    return conciliacion;
  }

  total(conci: ConciliacionCarteraDto): number {
    return (
      conci.VALRECPAG +
      conci.VALGLOSAD +
      conci.VALDEVUEL +
      conci.VALNORADI +
      conci.AUDITORIA +
      conci.RETENCION +
      conci.GLOSACEPTIPS +
      conci.PAGNOAPLI +
      conci.NOTNODESCEPS +
      conci.COPCUOMODE +
      conci.VALCANCEL
    );
  }

  diferencia(conci: ConciliacionCarteraDto): number {
    return conci.VALCONCI - this.total(conci);
  }

  async getActa(OID: number) {
    return await this.queryRunner.manager.query(
      `
    SELECT 
    GCC.OID IdConciliacion,
    GCC.RUTARCHI Ruta
    FROM GCMCONCCART GCC
    WHERE GCC.OID = @0
    `,
      [OID]
    );
  }

  borrararchivo(filename: string) {
    const path = `./${filename}`;
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
