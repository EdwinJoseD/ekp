import * as cn from "src/application/services/connection.service";
import { DietaEstadoEntity } from "src/domain/entities/hospitalizacion/dieta-estado.entity";

export const DietaEstadoRepository = (context: string) =>
  cn.getDataSource(context).getRepository(DietaEstadoEntity).extend({});
