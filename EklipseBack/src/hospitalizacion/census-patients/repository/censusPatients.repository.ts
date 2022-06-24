import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CensusPatientsRepository {
  private readonly connection: Connection;
  constructor(@Inject(REQUEST) req: Request, private authService: AuthService) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      this.connection = getManager(
        authService.getConnectionWithToken(token)
      ).connection;
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getCensusPatients(): Promise<any> {
    return await this.connection.query(
      `SELECT HPNESTANC, ADNINGRESO, AINCONSEC, AINFECING, 
      CASE AINURGCON
      WHEN -1 THEN 'NINGUNO'
      WHEN 0 THEN 'URGENCIAS'
      WHEN 1 THEN 'CONSULTA EXTERNA'
      WHEN 2 THEN 'NACIDO EN LA IPS'
      WHEN 3 THEN 'REMITIDO'
      WHEN 4 THEN 'HOSPITALIZACION DE URGENCIAS'
      WHEN 5 THEN 'HOSPITALIZACION'
      WHEN 6 THEN 'IMAGENES'
      WHEN 7 THEN 'LABORATORIO'
      WHEN 8 THEN 'URGENCIA GINECOLOGIA'
      WHEN 9 THEN 'QUIROFANO'
      WHEN 10 THEN 'CIRUGIA AMBULATORIA'
      WHEN 11 THEN 'CIRUGIA PROGRAMADA'
      WHEN 12 THEN 'UCI NEONATAL'
      WHEN 13 THEN 'UCI ADULTO'
      END AS AINURGCON, 
      CASE AINCAUING WHEN 0 THEN 'NINGUNA' WHEN 1 THEN 'ENFERMEDAD PROFESIONAL'
      WHEN 2 THEN 'HERIDOS EN COMBATE' WHEN 3 THEN 'ENFERMEDAD GENERAL DE ADULTO'
      WHEN 4 THEN 'ENFERMEDAD GENERAL DE PEDIATRIA' WHEN 5 THEN 'ODONTOLOGIA'
      WHEN 6 THEN 'ACCIDENTE DE TRANSITO' WHEN 7 THEN 'CATASTROFE DE FISALUD'
      WHEN 8 THEN 'QUEMADOS' WHEN 9 THEN 'MATERNIDAD'
      WHEN 10 THEN 'ACCIDENTE LABORAL' WHEN 11 THEN 'CIRUGIA PROGRAMADA'
      END AS AINCAUING,
      GENPRESAL, PRECODIGO, PRENOMBRE, HESFECSAL, AINDIAEST, HPNDEFCAM, HCACODIGO,
      HCANOMBRE, HCAESTADO, HGRCODIGO, HGRNOMBRE, HSUCODIGO, HSUNOMBRE,
      GENARESER, GASCODIGO, GASNOMBRE, GENPACIEN, GPADOCPAC, GPANOMPAC, GPAEDAPAC, 
      CASE GPASEXPAC
      WHEN 1 THEN 'MASCULINO' WHEN 2 THEN 'FEMENINO'
      END AS GPASEXPAC, 
      GPAESTPAC, 
      CASE GPATIPAFI
      WHEN 0 THEN 'NINGUNO' WHEN 1 THEN 'COTIZANTE'
      WHEN 2 THEN 'BENEFICIARIO' WHEN 3 THEN 'ADICIONAL'
      WHEN 4 THEN 'JUBILADO RETIRADO' WHEN 5 THEN 'PENSIONADO'
      END AS GPATIPAFI, GPADIRECC, GPATELEFO,
      GPAMUNPAC, AINACONOM, AINACOTEL, AINACUNOM, AINACUTEL, AINACUPAR, GENDIAGNO, 
      DIACODIGO, DIANOMBRE, GENDETCON, GDECODIGO, GDENOMBRE, ADNCENATE, ACACODIGO, 
      ACANOMBRE
      FROM     GCVHOSCENPAC
      WHERE  (HESFECSAL IS NULL) AND (HCAESTADO < 3)`
    );
  }

  async controlDesk(ingreso: string) {
    const evolution = await this.connection.query(
      `SELECT * FROM GCVHCNFOLEVO WHERE AINCONSEC = @0;`,
      [ingreso]
    );
    const solMedicamentos = await this.connection.query(
      `SELECT * FROM GCVHCNMEDPAC WHERE AINCONSEC = @0 ORDER BY HCSFECSOL DESC;`,
      [ingreso]
    );
    const solInsumos = await this.connection.query(
      `SELECT * FROM GCVHCNSOLENF WHERE AINCONSEC = @0 
      AND HCSFECSUS IS NULL AND HCSPENSUM >= 1 ORDER BY HCSFECSOL DESC;`,
      [ingreso]
    );
    const solExamenes = await this.connection.query(
      `SELECT * FROM GCVHCNSOLEXA WHERE AINCONSEC = @0 
      AND SOSESTADO = 0 ORDER BY HCSFECSOL DESC;`,
      [ingreso]
    );
    const solPatologias = await this.connection.query(
      `SELECT * FROM GCVHCNSOLPAT WHERE AINCONSEC = @0 
      AND SOSESTADO = 0 ORDER BY HCSFECSOL DESC`,
      [ingreso]
    );
    const solPQR = await this.connection.query(
      `SELECT * FROM GCVHCNSOLPQX WHERE AINCONSEC = @0 
      ORDER BY HCSFECSOL DESC;`,
      [ingreso]
    );
    const solPNQR = await this.connection.query(
      `SELECT * FROM GCVHCNSLPNQX WHERE AINCONSEC = @0 
      AND SOSESTADO = 0 ORDER BY HCSFECSOL DESC;`,
      [ingreso]
    );
    return {
      evolution,
      solMedicamentos,
      solInsumos,
      solExamenes,
      solPatologias,
      solPQR,
      solPNQR,
    };
  }
}
