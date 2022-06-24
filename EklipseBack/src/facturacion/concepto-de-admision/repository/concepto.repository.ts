import { Inject, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager, QueryRunner } from 'typeorm';
import { Request } from 'express';
import { IMedicamentos } from '../interface';

export class ConceptoRepository {
  private conceptoRepository: Connection;
  private conexion: string;
  private queryRunner: QueryRunner;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.conceptoRepository = getManager(this.conexion).connection;
      this.queryRunner = this.conceptoRepository.createQueryRunner();
      this.queryRunner.connect();
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO', error.message);
    }
  }

  async getmedicamentosTipos(ingreso: string, tipo: string) {
    return await this.conceptoRepository.query(
      `SELECT         
      SLNPROHOJ.OID, 
      INNPRODUC.IPRDESCOR, 
      GENCONFAC.GCFCODIGO, 
      GENCONFAC.GCFNOMBRE,
      SLNSERPRO.SERCANTID
       FROM            SLNPROHOJ AS SLNPROHOJ INNER JOIN
                               SLNSERPRO AS SLNSERPRO ON SLNSERPRO.OID = SLNPROHOJ.OID INNER JOIN
                               ADNINGRESO AS ADNINGRESO ON ADNINGRESO.OID = SLNSERPRO.ADNINGRES1 INNER JOIN
                               INNPRODUC ON SLNPROHOJ.INNPRODUC1 = INNPRODUC.OID INNER JOIN
                               GENCONFAC ON SLNPROHOJ.GENCONFAC = GENCONFAC.OID
      WHERE        (ADNINGRESO.AINCONSEC = @0)
      AND (GENCONFAC.GCFCODIGO = @1)`,
      [ingreso, tipo]
    );
  }

  async getmedicamentos(ingreso: string) {
    return await this.conceptoRepository.query(
      `SELECT         
      SLNPROHOJ.OID, 
      INNPRODUC.IPRDESCOR, 
      GENCONFAC.GCFCODIGO, 
      GENCONFAC.GCFNOMBRE,
      SLNSERPRO.SERCANTID
       FROM            SLNPROHOJ AS SLNPROHOJ INNER JOIN
                               SLNSERPRO AS SLNSERPRO ON SLNSERPRO.OID = SLNPROHOJ.OID INNER JOIN
                               ADNINGRESO AS ADNINGRESO ON ADNINGRESO.OID = SLNSERPRO.ADNINGRES1 INNER JOIN
                               INNPRODUC ON SLNPROHOJ.INNPRODUC1 = INNPRODUC.OID INNER JOIN
                               GENCONFAC ON SLNPROHOJ.GENCONFAC = GENCONFAC.OID
      WHERE        (ADNINGRESO.AINCONSEC = @0)`,
      [ingreso]
    );
  }

  async updateMedicamentos(medicamentos: IMedicamentos[]) {
    try {
      await this.queryRunner.startTransaction();
      medicamentos.forEach(async (el) => {
        await this.updatemedicamento(el.oid, el.tipo);
      });
      await this.queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Medicamentos actualizados correctamente',
      };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      return {
        success: false,
        message: 'Error al actualizar medicamentos',
      };
    }
  }

  async updatemedicamento(oid: string, tipo: number) {
    return await this.conceptoRepository.query(
      `UPDATE SLNPROHOJ SET GENCONFAC = @1 WHERE OID = @0`,
      [oid, tipo]
    );
  }
}
