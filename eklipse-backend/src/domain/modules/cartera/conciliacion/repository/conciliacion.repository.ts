import { ConciliacionEntity } from "src/domain/entities/cartera/conciliacion.entity";
import { ConciliacionCarteraDto } from "../dto/conciliacion.dto";
import * as cn from "src/application/services/connection.service";

export const ConciliacionRepository = (context: string) =>
  cn
    .getDataSource(context)
    .getRepository(ConciliacionEntity)
    .extend({
      async getConciliaciones() {
        return await cn.getDataSource(context).manager.query(`
        SELECT 
        GGC.OID IdGestion,
        GU.USUNOMBRE Identificacion,
        GU.USUDESCRI UsuarioEncargado,
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
      },
      async getConciliacionByGestion(oid: number) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const conciliacion = await qr.manager.findOne(ConciliacionEntity, {
            where: { GCMGESCART: oid },
          });
          return conciliacion;
        } catch (error) {
          await qr.rollbackTransaction();
          cn.ThrBadReqExc();
        } finally {
          await qr.release();
        }
      },
      async updateConciliacion(id: number, _conciliacion: ConciliacionCarteraDto) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const conciliacion = await qr.manager.findOne(ConciliacionEntity, { where: { ID: id } });
          const newConciliacion = this.Map(_conciliacion);
          const updatedConciliacion = Object.assign(conciliacion, newConciliacion);
          await qr.manager.save(ConciliacionEntity, updatedConciliacion);
          await qr.commitTransaction();
          return {
            success: true,
            message: "Conciliacion actualizada",
          };
        } catch (error) {
          await qr.rollbackTransaction();
          return { success: false, message: "Error al actualizar la conciliacion" };
        } finally {
          await qr.release();
        }
      },
      async updateActa(OID: number, namefile: string) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const conciliacion = await qr.manager.findOne(ConciliacionEntity, { where: { ID: OID } });
          const updatedConciliacion = Object.assign(conciliacion, {
            RUTARCHI: namefile,
          });
          await qr.manager.save(ConciliacionEntity, updatedConciliacion);
          await qr.commitTransaction();
          return {
            success: true,
            message: "Acta Cargada",
          };
        } catch (error) {
          await qr.rollbackTransaction();
          return { success: false, message: "Error al cargar el Acta" };
        } finally {
          await qr.release();
        }
      },
      async deleteConciliacion(oid: number) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const conciliacion = await qr.manager.findOne(ConciliacionEntity, { where: { ID: oid } });
          if (!conciliacion) {
            return { success: false, message: "No existe la conciliacion" };
          }
          await qr.manager.remove(conciliacion);
          await qr.commitTransaction();
          return {
            success: true,
            message: "Conciliacion eliminada",
          };
        } catch (error) {
          await qr.rollbackTransaction();
          return { success: false, message: "Error al eliminar la conciliacion" };
        } finally {
          await qr.release();
        }
      },
      Map(newConciliacion: ConciliacionCarteraDto) {
        const conciliacion = new ConciliacionEntity();
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
      },
      total(conci: ConciliacionCarteraDto): number {
        return conci.VALRECPAG + conci.VALCANCEL;
      },
      diferencia(conci: ConciliacionCarteraDto): number {
        return conci.VALCONCI - this.total(conci);
      },
      async getActa(OID: number) {
        return await cn.getDataSource(context).manager.query(
          `SELECT 
        GCC.OID IdConciliacion,
        GCC.RUTARCHI Ruta
        FROM GCMCONCCART GCC
        WHERE GCC.OID = @0
        `,
          [OID]
        );
      },
    });
