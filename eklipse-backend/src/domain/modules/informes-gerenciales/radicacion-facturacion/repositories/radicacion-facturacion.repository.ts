import * as cn from "src/application/services/connection.service";
import { RadFacturEntity } from "src/domain/entities/informes-gerenciales/rad-factur.entity";

export const RadiFactuRepository = (context: string) =>
  cn.getDataSource(context).getRepository(RadFacturEntity).extend({});
