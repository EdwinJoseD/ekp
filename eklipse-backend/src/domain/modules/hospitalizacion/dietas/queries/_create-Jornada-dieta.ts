import * as cn from "src/application/services/connection.service";
import * as findLast from "./_find-last-dietas";
import { DietaJornadaEntity } from "src/domain/entities/hospitalizacion/dieta-jornada.entity";
import { DietaCentroEntity } from "src/domain/entities/hospitalizacion/dieta-centro.entity";
import { DietaEstadoEntity } from "src/domain/entities/hospitalizacion/dieta-estado.entity";
import { DietaGrupoEntity } from "src/domain/entities/hospitalizacion/dieta-grupo.entity";
import { DietaCentroRepository } from "../repositories/dieta-centro.repository";
import { DietaGrupoRepository } from "../repositories/dieta-grupo.repository";
import { PacienteRegDieI } from "../interfaces/paciente-regdie.interface";
import { TipoDietasE } from "../enums/tipo-dietas.enum";
import { CreateJornadaDietaDto } from "../dtos/create-jornada-dieta.dto";
import { QueryRunner } from "typeorm";

export const createJornadaDieta = async (
  body: CreateJornadaDietaDto,
  authUserId: number,
  context: string
) => {
  const qr: QueryRunner = cn.getDataSource(context).createQueryRunner();
  await qr.connect();
  const dietaCentro = await getDietaCentro(body, authUserId, context);
  const dietaJornada = await getDietaJornada(dietaCentro, body, authUserId, context);
  const dietaGrupo = await getDietaGrupo(dietaJornada, body, authUserId, context);
  if (dietaGrupo === null) {
    return false;
  }
  const estados = [];
  body.pacientes.map(async (paciente: PacienteRegDieI, index) => {
    const estado = new DietaEstadoEntity();
    estado.DIETACENTRO = dietaCentro.ID;
    estado.DIETAJORNADA = dietaJornada.ID;
    estado.DIETAGRUPO = dietaGrupo.ID;
    estado.CENTROATENCION = body.centroAtencion;
    estado.SUBGRUPO = body.subgrupoCama;
    estado.FECHADIETA = new Date();
    estado.JORNADA = body.jornadaDieta;
    estado.ESTADODIETA = 1;
    estado.ESTANCIA = paciente.HPNESTANC;
    estado.TIPO = paciente.DIEGRUTIP;
    estado.CONSISTENCIA = paciente.DIEGRUCON;
    estado.OBSERVACION = paciente.DIEGRUOBS;
    estado.USERREGDIETA = authUserId;
    estado.FECHAREGDIETA = new Date();
    estados.push(estado);
    if (index === body.pacientes.length - 1) {
      await qr.startTransaction();
      try {
        await qr.manager.save(DietaEstadoEntity, estados);
        await qr.manager.save(DietaCentroEntity, dietaCentro);
        await qr.manager.save(DietaJornadaEntity, dietaJornada);
        await qr.manager.save(DietaGrupoEntity, dietaGrupo);
        await qr.commitTransaction();
      } catch (error) {
        await qr.rollbackTransaction();
        cn.ThrBadReqExc();
      } finally {
        await qr.release();
      }
    }
  });
  return true;
};
/**
 * Retorna una entidad DietaCentro si existe, si no, crea una nueva.
 * @param body
 * @param authUserId
 * @param context
 */
const getDietaCentro = async (
  body: CreateJornadaDietaDto,
  authUserId: number,
  context: string
): Promise<DietaCentroEntity> => {
  const dietaCentro = await DietaCentroRepository(context).findDietaCentro(
    body.fechaRegistro,
    body.centroAtencion
  );
  const lastDieta = await findLast.DietaCentro(context);
  if (dietaCentro === null) {
    const newDietaCentro = new DietaCentroEntity();
    newDietaCentro.ID = lastDieta[0].OID + 1;
    newDietaCentro.CENTROATENCION = body.centroAtencion;
    newDietaCentro.FECHADIETA = new Date(`${body.fechaRegistro}T05:00:00.000Z`);
    newDietaCentro.DIETAESTADO = 1;
    newDietaCentro.USERREGDIETA = authUserId;
    newDietaCentro.FECHAREGDIETA = new Date();
    return cn.getDataSource(context).manager.create(DietaCentroEntity, newDietaCentro);
  } else {
    return dietaCentro;
  }
};
/**
 * Retorna una entidad DietaJornada.
 * @param dietaCentro
 * @param body
 * @param authUserId
 * @param context
 */
const getDietaJornada = async (
  dietaCentro: DietaCentroEntity,
  body: CreateJornadaDietaDto,
  authUserId: number,
  context: string
) => {
  const { jornadaDieta } = body;
  let DIETA_JORNADA: string;
  if (jornadaDieta === TipoDietasE.DESAYUNO) {
    DIETA_JORNADA = "DIETADESAYUNO";
  }
  if (jornadaDieta === TipoDietasE.ALMUERZO) {
    DIETA_JORNADA = "DIETAALMUERZO";
  }
  if (jornadaDieta === TipoDietasE.CENA) {
    DIETA_JORNADA = "DIETACENA";
  }
  if (dietaCentro[DIETA_JORNADA] === null || dietaCentro[DIETA_JORNADA] === undefined) {
    const dietaJornada = await createDietaJornada(dietaCentro, body, context, authUserId);
    dietaCentro[DIETA_JORNADA] = dietaJornada.ID;
    return dietaJornada;
  } else {
    const dietaJornada = await cn
      .getDataSource(context)
      .manager.getRepository(DietaJornadaEntity)
      .findOne({
        where: [{ DIETACENTRO: dietaCentro.ID, ID: dietaCentro[DIETA_JORNADA] }],
      });
    return dietaJornada;
  }
};
/**
 * Crea una nueva entidad de tipo DietaJornada.
 * @param dietaCentro
 * @param body
 * @param context
 * @param authUserId
 */
const createDietaJornada = async (
  dietaCentro: DietaCentroEntity,
  body: CreateJornadaDietaDto,
  context: string,
  authUserId: number
): Promise<DietaJornadaEntity> => {
  const lastDietaJornada = await findLast.DietaJornada(context);
  const newDietaJornada = new DietaJornadaEntity();
  newDietaJornada.ID = lastDietaJornada[0].OID + 1;
  newDietaJornada.DIETACENTRO = dietaCentro.ID;
  newDietaJornada.CENTROATENCION = body.centroAtencion;
  newDietaJornada.FECHADIETA = new Date(`${body.fechaRegistro}T05:00:00.000Z`);
  newDietaJornada.JORNADADIETA = body.jornadaDieta;
  newDietaJornada.DIETAESTADO = 1;
  newDietaJornada.USERREGDIETA = authUserId;
  newDietaJornada.FECHAREGDIETA = new Date();
  return cn.getDataSource(context).manager.create(DietaJornadaEntity, newDietaJornada);
};
/**
 * Crea una entidad de tipo DietaGrupo si no existe una previamente, si existe una, significa que
 * el grupo que intenta registrar el usuario fué registrado previamente en la jornada seleccionada.
 * @param DietaJornada
 * @param body
 * @param authUserId
 * @param context
 */
const getDietaGrupo = async (
  DietaJornada: DietaJornadaEntity,
  body: CreateJornadaDietaDto,
  authUserId: number,
  context: string
) => {
  const lastDietaGrupo = await findLast.DietaGrupo(context);
  const dietaGrupo = await DietaGrupoRepository(context).findDietaGrupo(
    DietaJornada.ID,
    body.subgrupoCama
  );
  if (dietaGrupo === null) {
    const newDietaGrupo = new DietaGrupoEntity();
    newDietaGrupo.ID = lastDietaGrupo[0].OID + 1;
    newDietaGrupo.DIETACENTRO = DietaJornada.DIETACENTRO;
    newDietaGrupo.DIETAJORNADA = DietaJornada.ID;
    newDietaGrupo.CENTROATENCION = body.centroAtencion;
    newDietaGrupo.SUBGRUPO = body.subgrupoCama;
    newDietaGrupo.JORNADADIETA = body.jornadaDieta;
    newDietaGrupo.FECHADIETA = new Date(`${body.fechaRegistro}T05:00:00.000Z`);
    newDietaGrupo.ESTADODIETA = 1;
    newDietaGrupo.USERREGDIETA = authUserId;
    newDietaGrupo.FECHAREGDIETA = new Date();
    return cn.getDataSource(context).manager.create(DietaGrupoEntity, newDietaGrupo);
  } else {
    return null;
  }
};
