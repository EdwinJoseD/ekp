import { getManager, Repository } from 'typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DietaEstado } from '../entity';
import { AuthService } from 'src/auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DietaEstadoRepository {
  public repository: Repository<DietaEstado>;
  constructor(
    @Inject(REQUEST) request: Request,
    private readonly authService: AuthService
  ) {
    try {
      this.repository = getManager(
        authService.switchConnection('AC')
      ).getRepository(DietaEstado);
    } catch (error) {
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getDietaEstado(dietaJornada: number) {
    try {
      const dietaEstado = await this.repository.manager.query(
        `SELECT G.GCMDIEJOR ID, 
        G.HPNESTANC,
        H.HSUNOMBRE SUBGRUPO,
        H.HCACODIGO CAMA,
        H.GPANOMPAC,
        (CASE G.DIEJORNAD
        WHEN 1 THEN 'DESAYUNO'
        WHEN 2 THEN 'ALMUERZO'
        WHEN 3 THEN 'CENA'
        ELSE ''
        END)
        AS JORNADA,
        G.DIEGRUTIP TIPO,
        G.DIEGRUCON CONSISTENCIA,
        (CASE G.DIEGRUCON
        WHEN 'LIQUIDA' THEN (SELECT PRECIO FROM GCMPRECOM WHERE OID = 4)
        WHEN 'LICUADOS SIN GRUMOS' THEN (SELECT PRECIO FROM GCMPRECOM WHERE OID = 4)
        ELSE P.PRECIO
        END) AS VALOR,
        G.DIEFECJOR FECHA,
        G.DIEESTADO ESTADO
        FROM GCMHOSDIEEST G
        INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
        INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
        WHERE G.GCMDIEJOR = @0;`,
        [dietaJornada]
      );
      const totalJornada = await this.repository.manager.query(
        `SELECT
        SUM((CASE G.DIEGRUCON
        WHEN 'LIQUIDA' THEN 3700
        WHEN 'LICUADOS SIN GRUMOS' THEN 3700
        ELSE P.PRECIO
        END)) AS VALOR
        FROM GCMHOSDIEEST G
        INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
        INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
        WHERE G.GCMDIEJOR = @0 GROUP BY G.GCMDIEJOR;`,
        [dietaJornada]
      );
      return { dietaEstado, totalJornada };
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un error al Obtener los pacientes con dietas',
        error.message
      );
    }
  }

  async getTotalJornada(dietaJornada: number) {
    try {
      return await this.repository.manager.query(
        `SELECT
        SUM((CASE G.DIEGRUCON
        WHEN 'LIQUIDA' THEN 3700
        WHEN 'LICUADOS SIN GRUMOS' THEN 3700
        ELSE P.PRECIO
        END)) AS VALOR
        FROM GCMHOSDIEEST G
        INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
        INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
        WHERE G.GCMDIEJOR = @0 GROUP BY G.GCMDIEJOR;`,
        [dietaJornada]
      );
    } catch (error) {
      throw new BadRequestException(
        `Ocurrio un error al Obtener el total de la jornada ${dietaJornada}.`,
        error.message
      );
    }
  }

  async getDietaEstado_Subgrupo(dietaJornada: number) {
    const res = await this.repository.manager.query(
      `SELECT G.GCMDIEJOR ID, 
      G.HPNESTANC,
      H.HSUCODIGO CODIGO,
      H.HSUNOMBRE SUBGRUPO,
      H.HCACODIGO CAMA,
      H.GPANOMPAC,
      (CASE G.DIEJORNAD
      WHEN 1 THEN 'DESAYUNO'
      WHEN 2 THEN 'ALMUERZO'
      WHEN 3 THEN 'CENA'
      ELSE ''
      END)
      AS JORNADA,
      G.DIEGRUTIP TIPO,
      G.DIEGRUCON CONSISTENCIA,
      (CASE G.DIEGRUCON
      WHEN 'LIQUIDA' THEN (SELECT PRECIO FROM GCMPRECOM WHERE OID = 4)
      WHEN 'LICUADOS SIN GRUMOS' THEN (SELECT PRECIO FROM GCMPRECOM WHERE OID = 4)
      ELSE P.PRECIO
      END) AS VALOR,
      G.DIEFECJOR FECHA
      FROM GCMHOSDIEEST G
      INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
      INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
      WHERE G.GCMDIEJOR = @0;`,
      [dietaJornada]
    );
    const grupos = res.reduce((h, obj) => {
      h[obj.SUBGRUPO] = (h[obj.SUBGRUPO] || []).concat(obj);
      return h;
    }, {});
    return grupos;
  }

  async getTotalJornada_Subgrupo(dietaJornada: number) {
    try {
      return await this.repository.manager.query(
        `SELECT
        SUM((CASE G.DIEGRUCON
        WHEN 'LIQUIDA' THEN 3700
        WHEN 'LICUADOS SIN GRUMOS' THEN 3700
        ELSE P.PRECIO
        END)) AS VALOR
        FROM GCMHOSDIEEST G
        INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
        INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
        WHERE G.GCMDIEJOR= @0 GROUP BY G.HPNSUBGRU;`,
        [dietaJornada]
      );
    } catch (error) {
      throw new BadRequestException(
        `Ocurrio un error al Obtener el total de la jornada ${dietaJornada}.`,
        error.message
      );
    }
  }

  async getCombinaciones(dietaJornada: number) {
    try {
      return await this.repository.manager.query(
        `EXEC ObtenerCombinacionesDeDieta @0;`,
        [dietaJornada]
      );
    } catch (error) {
      throw new BadRequestException(
        'Ocurrio un error al obtener combinaciones ',
        error.message
      );
    }
  }

  async getConsistencia(dietaJornada: number) {
    try {
      return await this.repository.manager.query(
        `
      SELECT G.GCMDIEJOR JORNADA, 
G.DIEGRUCON CONSISTENCIA, 
COUNT(*) CANTIDAD,
SUM((CASE G.DIEGRUCON
WHEN 'LIQUIDA' THEN 3700
WHEN 'LICUADOS SIN GRUMOS' THEN 3700
ELSE P.PRECIO
END)) VALOR
FROM GCMHOSDIEEST G
INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
WHERE GCMDIEJOR = @0 
GROUP BY GCMDIEJOR, DIEGRUCON;
      `,
        [dietaJornada]
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async getDietaJornada_subgrrupo(dietaJornada: number, subgroup: number) {
    try {
      const res = await this.repository.manager.query(
        `SELECT G.GCMDIEJOR ID, 
        G.HPNESTANC,
        h.HSUCODIGO CODIGO,
        H.HSUNOMBRE SUBGRUPO,
        H.HCACODIGO CAMA,
        H.GPANOMPAC,
        (CASE G.DIEJORNAD
        WHEN 1 THEN 'DESAYUNO'
        WHEN 2 THEN 'ALMUERZO'
        WHEN 3 THEN 'CENA'
        ELSE ''
        END)
        AS JORNADA,
        G.DIEGRUTIP TIPO,
        G.DIEGRUCON CONSISTENCIA,
        (CASE G.DIEGRUCON
        WHEN 'LIQUIDA' THEN (SELECT PRECIO FROM GCMPRECOM WHERE OID = 4)
        WHEN 'LICUADOS SIN GRUMOS' THEN (SELECT PRECIO FROM GCMPRECOM WHERE OID = 4)
        ELSE P.PRECIO
        END) AS VALOR,
        G.DIEFECJOR FECHA
        FROM GCMHOSDIEEST G
        INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
        INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
        WHERE G.GCMDIEJOR = @0 AND G.HPNSUBGRU = @1;`,
        [dietaJornada, subgroup]
      );
      const grupos = res.reduce((h, obj) => {
        h[obj.SUBGRUPO] = (h[obj.SUBGRUPO] || []).concat(obj);
        return h;
      }, {});
      return grupos;
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async confirmacionEntrega(jornada: number) {
    try {
      return await this.repository.query(
        `SELECT 
      HPNSUBGRU,
      CASE DIEESTADO
      WHEN 1 THEN 'PENDIENTES'
      WHEN 9 THEN 'ENTREGADAS'
      ELSE 'DEVUELTAS'
      END AS ESTADO
      , COUNT(*) CANTIDAD FROM GCMHOSDIEEST
       WHERE GCMDIEJOR = @0 GROUP BY HPNSUBGRU, DIEESTADO
      UNION
      SELECT 
      HPNSUBGRU, 
      'TOTAL' AS ESTADO, 
      COUNT(*)AS CANTIDAD FROM GCMHOSDIEEST
       WHERE GCMDIEJOR = @0  GROUP BY HPNSUBGRU, GCMDIEJOR
      `,
        [jornada]
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async facturacionGeneral(fechaInicio: string, fechaFinal: string) {
    try {
      return await this.repository.manager.query(
        `SELECT
        G.DIEFECJOR,
          A.ACANOMBRE,
              SUM((CASE G.DIEGRUCON
              WHEN 'LIQUIDA' THEN 3700
              WHEN 'LICUADOS SIN GRUMOS' THEN 3700
              ELSE P.PRECIO
              END)) AS TOTALJORNADA
              FROM GCMHOSDIEEST G
              INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
              INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
            INNER JOIN ADNCENATE A ON G.ADNCENATE = A.OID
              WHERE G.DIEFECJOR BETWEEN @0 AND @1 GROUP BY G.DIEFECJOR, A.ACANOMBRE;
        `,
        [fechaInicio, fechaFinal]
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }

  async facturacionPorCentro(fecha: string, centro: string) {
    try {
      return await this.repository.manager.query(
        `SELECT
        G.DIEFECJOR,
        COUNT(*) AS CANTIDAD,
        (CASE G.DIEJORNAD
          WHEN 1 THEN 'DESAYUNO'
          WHEN 2 THEN 'ALMUERZO'
          WHEN 3 THEN 'CENA'
          ELSE ''
          END) AS JORNADA,
          A.ACANOMBRE,
              SUM((CASE G.DIEGRUCON
              WHEN 'LIQUIDA' THEN 3700
              WHEN 'LICUADOS SIN GRUMOS' THEN 3700
              ELSE P.PRECIO
              END)) AS TOTALJORNADA
              FROM GCMHOSDIEEST G
              INNER JOIN GCVHOSCENPAC H ON H.HPNESTANC = G.HPNESTANC
              INNER JOIN GCMPRECOM P ON P.OID = G.DIEJORNAD
            INNER JOIN ADNCENATE A ON G.ADNCENATE = A.OID
              WHERE G.DIEFECJOR = @0 
              AND A.ACANOMBRE = @1 
              GROUP BY G.DIEFECJOR, G.DIEJORNAD, A.ACANOMBRE
        `,
        [fecha, centro]
      );
    } catch (error) {
      throw new BadRequestException('Ocurrio un Error', error.message);
    }
  }
}
