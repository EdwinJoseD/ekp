import * as cn from "src/application/services/connection.service";
import { CentroAtencionEntity } from "src/domain/entities/seguridad/centro-atencion.entity";

export const CentroAtencionRepository = (context: string) =>
  cn.getDataSource(context).getRepository(CentroAtencionEntity).extend({});
