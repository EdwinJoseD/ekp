import { GestionCarteraDto } from "../dto/gestion.dto";
import { GestionEntity } from "src/domain/entities/cartera/gestion.entity";
import { ConciliacionEntity } from "src/domain/entities/cartera/conciliacion.entity";
import * as cn from "src/application/services/connection.service";

export const GestionRepository = (context: string) =>
  cn
    .getDataSource(context)
    .getRepository(GestionEntity)
    .extend({
      async getTercero(nit: string) {
        return await cn.getDataSource(context).query(
          `SELECT 
        OID, 
        TERNUMDOC, 
        TERNOMCOM 
        FROM GENTERCER 
        WHERE TERACTINAC = 1 
        AND TERNUMDOC = @0
    `,
          [nit]
        );
      },
      async getGestions() {
        return await cn.getDataSource(context).query(
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
      },
      async addGestion(gestion: GestionCarteraDto) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const gestionCartera: GestionEntity = await this.Map(gestion);
          const createdGestion = qr.manager.create(GestionEntity, gestionCartera);
          if (gestion.FECHCONCI !== null) {
            const cretaedConciliacion = await this.addConciliacion(createdGestion);
            await qr.manager.save(ConciliacionEntity, cretaedConciliacion);
          }
          await qr.manager.save(GestionEntity, createdGestion);
          await qr.commitTransaction();
          return {
            success: true,
            message: "Gestion creada con exito",
          };
        } catch (error) {
          await qr.rollbackTransaction();
          return {
            success: false,
            message: "Error al Crear la Gestion",
          };
        } finally {
          await qr.release();
        }
      },
      async updateGestion(oid: number, gestion: GestionCarteraDto) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const findGestion = await qr.manager.findOne(GestionEntity, {
            where: { ID: oid },
          });
          const updatedGestion = Object.assign(findGestion, gestion);
          if (updatedGestion.FECHCONCI !== null) {
            const cretaedConciliacion = await this.addConciliacion(updatedGestion);
            await qr.manager.save(ConciliacionEntity, cretaedConciliacion);
          }
          await qr.manager.save(GestionEntity, updatedGestion);
          await qr.commitTransaction();
          return {
            success: true,
            message: "Gestion actualizada con exito",
          };
        } catch (error) {
          await qr.rollbackTransaction();
          return { success: false, message: "Error al actualizar la Gestion" };
        } finally {
          await qr.release();
        }
      },
      async deleteGestion(oid: number) {
        const qr = cn.getDataSource(context).createQueryRunner();
        await qr.connect();
        try {
          await qr.startTransaction();
          const findGestion = await qr.manager.findOne(GestionEntity, {
            where: { ID: oid },
          });
          if (!findGestion) {
            return { success: false, message: "La Gestion no existe" };
          }
          const conciliacion = await this.RepoConciliacion.getConciliacionByGestion(findGestion.ID);
          if (conciliacion) {
            return {
              success: false,
              message: "No se puede eliminar la gestion por que tiene una conciliacion abierta",
            };
          } else {
            await qr.manager.remove(GestionEntity, findGestion);
            await qr.commitTransaction();
            return {
              success: true,
              message: "Gestion eliminada con exito",
            };
          }
        } catch (error) {
          await qr.rollbackTransaction();
          return { success: false, message: "Error al eliminar la Gestion" };
        } finally {
          await qr.release();
        }
      },
      async addConciliacion(gestion: GestionEntity): Promise<ConciliacionEntity> {
        const conciliacion = new ConciliacionEntity();
        if (gestion.ID) {
          conciliacion.GCMGESCART = gestion.ID;
          conciliacion.FECHACONC = new Date(gestion.FECHCONCI);
          const findConci = await cn.getDataSource(context).manager.findOne(ConciliacionEntity, {
            where: { GCMGESCART: gestion.ID },
          });
          const asign = Object.assign(findConci, conciliacion);
          return asign;
        } else {
          const gest = await cn
            .getDataSource(context)
            .manager.query(`SELECT TOP 1 OID FROM GCMGESCART ORDER BY OID DESC`);
          if (gest.length > 0) {
            conciliacion.GCMGESCART = gest[0].OID + 1;
            conciliacion.FECHACONC = new Date(gestion.FECHCONCI);
            return cn.getDataSource(context).manager.create(ConciliacionEntity, conciliacion);
          } else {
            conciliacion.FECHACONC = new Date(gestion.FECHCONCI);
            conciliacion.GCMGESCART = 1;
            return cn.getDataSource(context).manager.create(ConciliacionEntity, conciliacion);
          }
        }
      },
      async Map(gestionDto: GestionCarteraDto): Promise<GestionEntity> {
        const gestion = new GestionEntity();
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
      },
    });
