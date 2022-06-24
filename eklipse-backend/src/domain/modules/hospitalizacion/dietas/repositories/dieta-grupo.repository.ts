import * as cn from "src/application/services/connection.service";
import { DietaGrupoEntity } from "src/domain/entities/hospitalizacion/dieta-grupo.entity";

export const DietaGrupoRepository = (context: string) =>
  cn
    .getDataSource(context)
    .getRepository(DietaGrupoEntity)
    .extend({
      async findDietaGrupo(dietaJornadaId: number, subgrupoCama: number): Promise<DietaGrupoEntity> {
        try {
          const res = await DietaGrupoRepository(context).findOne({
            where: [{ DIETAJORNADA: dietaJornadaId, SUBGRUPO: subgrupoCama }],
          });
          return res;
        } catch (error) {
          cn.ThrBadReqExc();
        }
      },
    });
