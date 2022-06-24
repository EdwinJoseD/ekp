import { dsVALLEDUPAR } from "src/infrastructure/datasources/VDP.datasource";
import { dsALTACENTRO } from "src/infrastructure/datasources/AC.datasource";
import { dsAGUACHICA } from "src/infrastructure/datasources/AGU.datasource";
import { dsSANJUAN } from "src/infrastructure/datasources/SJ.datasource";
import { ContextsE as ctxts } from "src/application/enums/contexts.enum";
import { BadRequestException } from "@nestjs/common";
import { DataSource } from "typeorm";

/**
 * Realiza la conexión con la base de datos perteneciente al contexto en el
 * cual el usuario está autenticado.
 * @param context
 * @returns Datasource
 */
export const getDataSource = (context: string): DataSource => {
  let ds: any;
  if (context === ctxts.ALTACENTRO) {
    ds = dsALTACENTRO;
  } else if (context === ctxts.AGUACHICA) {
    ds = dsAGUACHICA;
  } else if (context === ctxts.VALLEDUPAR) {
    ds = dsVALLEDUPAR;
  } else if (context === ctxts.SANJUAN) {
    ds = dsSANJUAN;
  } else {
    ds = dsALTACENTRO;
  }
  const dataSource = ds;
  return dataSource;
};
/**
 * Manejo de posibles excepciones al solicitar información de la base de datos.
 * @param error
 */
export const ThrBadReqExc = (error?: any): BadRequestException => {
  throw new BadRequestException(error);
};
export const DataSourceInitSuccess = (context: string = ""): string => {
  return `DataSource ${context} fue inicializada correctamente!`;
};
export const DataSourceInitFail = (context: string = ""): string => {
  return `Error durante inicialización de DataSource ${context}`;
};
