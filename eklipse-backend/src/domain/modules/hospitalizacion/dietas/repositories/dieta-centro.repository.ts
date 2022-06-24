import * as cn from "src/application/services/connection.service";
import { DietaCentroEntity } from "src/domain/entities/hospitalizacion/dieta-centro.entity";

export const DietaCentroRepository = (context: string) =>
  cn
    .getDataSource(context)
    .getRepository(DietaCentroEntity)
    .extend({
      async findDietaCentro(fechaDieta: string, centroAtencionId: number): Promise<DietaCentroEntity> {
        try {
          const date = new Date(`${fechaDieta}T05:00:00.000Z`);
          const res = await DietaCentroRepository(context).findOne({
            where: [{ CENTROATENCION: centroAtencionId, FECHADIETA: date }],
          });
          return res;
        } catch (error) {
          cn.ThrBadReqExc();
        }
      },
    });
