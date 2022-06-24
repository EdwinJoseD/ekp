import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class EstanciasService {
  private repository: Connection;
  private conexion: string;

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      this.conexion = authService.getConnectionWithToken(token);
      this.repository = getManager(this.conexion).connection;
    } catch (error) {
      throw new BadRequestException(
        'Erro en la base de datos: ',
        error.message
      );
    }
  }

  async traer_paciente_acostados() {
    const pacientes: any[] = await this.repository.manager.query(`
    SELECT HPNESTANC, ADNINGRESO, AINCONSEC, AINFECING, 
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
      WHERE  (HESFECSAL IS NULL) 
             AND (HCAESTADO < 3) 
             AND AINURGCON <> 1
             `);

    const PEstancias = await Promise.all(
      pacientes.map(async (p) => {
        const estancia = await this.estancias_paciente(p.GPADOCPAC);
        let i = 0;
        let suma = 0;
        let camas = [];
        while (i < estancia.length) {
          const actual = estancia[i];
          const anterior = estancia[i + 1] ? estancia[i + 1] : null;
          if (anterior) {
            const diferencia =
              (actual.AINFECING - anterior.AINFECEGRE) / (1000 * 60 * 60 * 24);
            if (diferencia <= 2.99) {
              suma = actual.DIAS + anterior.DIAS;
              const cama = await this.get_camas(actual.AINCONSEC);
              camas = await this.get_camas(anterior.AINCONSEC);
              camas = camas.concat(cama);
              break;
            } else {
              if (i + 1 == estancia.length - 1) {
                camas = await this.get_camas(estancia[0].AINCONSEC);
                suma += estancia[0].DIAS;
              } else {
                camas = await this.get_camas(actual.AINCONSEC);
                suma += actual.DIAS;
              }
              break;
            }
          } else if (i == 0 && !anterior) {
            camas = await this.get_camas(estancia[0].AINCONSEC);
            suma += estancia[0].DIAS;
          }
          i++;
        }
        return {
          AINCONSEC: p.AINCONSEC,
          ADNINGRESO: p.ADNINGRESO,
          GPADOCPAC: p.GPADOCPAC,
          ESTANCIA: suma,
          CAMAS: camas,
          GDECODIGO: p.GDECODIGO,
          GDENOMBRE: p.GDENOMBRE,
          ...p,
        };
      })
    );
    return PEstancias;
  }

  async estancias_paciente(paciente: string) {
    const estancias = await this.repository.manager.query(
      `
      SELECT
      AINCONSEC,
      P.PACNUMDOC,
      I.AINFECING,
      ISNULL(I.AINFECEGRE, GETDATE()) AINFECEGRE,
      (DateDiff(DAY, I.AINFECING, ISNULL(I.AINFECEGRE, GETDATE()))) DIAS
      from ADNINGRESO I
      INNER JOIN GENPACIEN P ON I.GENPACIEN = P.OID
      INNER JOIN GENDETCON C ON C.OID = I.GENDETCON
      WHERE 
      P.PACNUMDOC = @0
      AND AINESTADO != 2 
      AND I.AINESTADO IN(0,1) 
      AND GDENOMBRE NOT LIKE '%NO POS%' 
      AND I.AINURGCON <> 1
      AND (DateDiff(HOUR, I.AINFECING, I.AINFECEGRE) > 6 OR I.AINFECFAC IS NULL)
      ORDER BY I.AINFECING DESC
      `,
      [paciente]
    );
    return estancias;
  }

  async get_camas(consecutivo: string) {
    return await this.repository.manager.query(
      `SELECT
      A.AINCONSEC Ingreso,
      H.HESFECING FechaIngreso,
      H.HESFECSAL FechaSalida,
      HCANOMBRE Grupo,
      HD.HCACODIGO Cama,
    DATEDIFF(DAY, H.HESFECING, ISNULL(H.HESFECSAL, GETDATE())) DIAS
      FROM HPNESTANC H
      INNER JOIN ADNINGRESO A ON A.OID = H.ADNINGRES
      INNER JOIN HPNDEFCAM HD ON HD.OID = H.HPNDEFCAM
      WHERE A.AINCONSEC = @0
      AND A.AINESTADO IN(0,1)
      AND (DateDiff(HOUR, A.AINFECING, A.AINFECEGRE) > 6 OR A.AINFECFAC IS NULL);
      `,
      [consecutivo]
    );
  }
}
