import { Inject, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Connection, getManager } from 'typeorm';
import { Request } from 'express';
import { ResumenFacturacion } from '../class';
import {
  Deficit,
  DeficitPGP,
  Cumplimiento,
  FacturadoPGP,
  FacturadoPeriodo,
  FacturadoSubtotal,
} from '../helpers';

export class FacturacionRepository {
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
      throw new UnauthorizedException('NO ESTAS AUTHENTICADO');
    }
  }

  async getFacturacionResumen(
    fechaInicio: string,
    fechaFin: string,
    centro1: number,
    centro2: number
  ) {
    if (this.conexion === 'AC') {
      const resumen = await this.repository.manager.query(
        `
        SELECT 
          COUNT(*) DOCUMENTOS,
          COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
          COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
  
          (SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      -ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
      ) FACTURADOEVENTO,
          SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END) REGISTROPGP,
          (
          SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
          + SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
          -ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          ) PRODUCCION,
          ISNULL(SUM(CASE WHEN CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN NULL ELSE  SFAVALREC END), 0) FACTRECUPERACION,
          ISNULL(SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0) TOTALFACTURASANULADAS,
  
  
          (
          SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END)
          - ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          + ISNULL(SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          ) FACTURADOSUBTOTAL,
  
          ISNULL(SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END), 0) TOTALREFACTURADA,
          (
          SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
          - ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          + ISNULL(SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          - ISNULL(SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END), 0)
          ) FACTURADOPERIODO,
  
  
          ISNULL(SUM(CASE WHEN (SFATIPDOC = 16 OR C.GDECODIGO ='8014') AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0) FACTURADOPGP,
          (
      SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
          - ISNULL(SUM(CASE WHEN (SFATIPDOC = 16 OR C.GDECODIGO ='8014') AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
      ) DEFICITPGP
  
          FROM GCVUSUFACTUR
          INNER JOIN GENDETCON C ON C.OID = GCVUSUFACTUR.GENDETCON
          WHERE
          CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
          AND SFACANANU < 1
          AND ADNCENATE IN(@2, @3)
  
        `,
        [fechaInicio, fechaFin, centro1, centro2]
      );
      const meta = await this.repository.manager.query(
        `
              SELECT 
        SUM(CASE MONTH(@0)
        WHEN 1 THEN CENPROENE
        WHEN 2 THEN CENPROFEB
        WHEN 3 THEN CENPROMAR
        WHEN 4 THEN CENPROABR
        WHEN 5 THEN CENPROMAY
        WHEN 6 THEN CENPROJUN
        WHEN 7 THEN CENPROJUL
        WHEN 8 THEN CENPROAGO
        WHEN 9 THEN CENPROSEP
        WHEN 10 THEN CENPROOCT
        WHEN 11 THEN CENPRONOV
        WHEN 13 THEN CENPRODIC
        ELSE
        0
        END) META
        FROM
        GCMCENATEPRO
        WHERE 
        PERIODO = YEAR(@0)
        AND ADNCENATE IN(@2, @3)
        `,
        [fechaInicio, fechaFin, centro1, centro2]
      );
      const resumenConstant = await this.repository.manager.query(
        `
        SELECT 
          COUNT(*) DOCUMENTOS,
          COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
          COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
  
          (SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      -ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
      ) FACTURADOEVENTO,
          SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END) REGISTROPGP,
          (
          SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
          + SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
          -ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          ) PRODUCCION,
          ISNULL(SUM(CASE WHEN CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN NULL ELSE  SFAVALREC END), 0) FACTRECUPERACION,
          ISNULL(SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0) TOTALFACTURASANULADAS,
  
  
          (
          SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END)
          - ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          + ISNULL(SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          ) FACTURADOSUBTOTAL,
  
          ISNULL(SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END), 0) TOTALREFACTURADA,
          (
          SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
          - ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          + ISNULL(SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          - ISNULL(SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END), 0)
          ) FACTURADOPERIODO,
  
  
          ISNULL(SUM(CASE WHEN (SFATIPDOC = 16 OR C.GDECODIGO ='8014') AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0) FACTURADOPGP,
          (
            ISNULL(SUM(CASE WHEN (SFATIPDOC = 16 OR C.GDECODIGO ='8014') AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
            -SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
          ) DEFICITPGP
  
          FROM GCVUSUFACTUR
          INNER JOIN GENDETCON C ON C.OID = GCVUSUFACTUR.GENDETCON
          WHERE
          CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
          AND SFACANANU < 1`,
        [fechaInicio, fechaFin]
      );
      const egresos = await this.repository.manager.query(
        `SELECT 
        COUNT(*) CANTIDAD,
        ISNULL(SUM(C.VALOR), 0) VALOR
        FROM 
        ADNEGRESO E
        RIGHT JOIN(
        SELECT 
        dbo.ADNEGRESO.OID AS ADNEGRESO,
        SUM(dbo.SLNSERPRO.SERVALPRO * dbo.SLNSERPRO.SERCANTID) AS VALOR
        FROM     
        dbo.SLNSERPRO INNER JOIN
        dbo.ADNINGRESO ON dbo.ADNINGRESO.OID = dbo.SLNSERPRO.ADNINGRES1 INNER JOIN
        dbo.ADNEGRESO ON dbo.ADNEGRESO.ADNINGRESO = dbo.ADNINGRESO.OID INNER JOIN
        dbo.SLNORDSER ON dbo.SLNORDSER.OID = dbo.SLNSERPRO.SLNORDSER1 AND dbo.SLNORDSER.SOSESTADO <> 2
        WHERE CONVERT(DATE, dbo.ADNEGRESO.ADEFECSAL, 103) BETWEEN @0 AND @1 
        AND AINESTADO != 1
	    	AND ADNCENATE IN(@2, @3)
        GROUP BY 
        dbo.ADNEGRESO.OID
		) C ON C.ADNEGRESO = E.OID`,
        [fechaInicio, fechaFin, centro1, centro2]
      );
      return { resumen, resumenConstant, meta, egresos };
    } else {
      const meta = await this.repository.manager.query(
        `
              SELECT 
        SUM(CASE MONTH(@0)
        WHEN 1 THEN CENPROENE
        WHEN 2 THEN CENPROFEB
        WHEN 3 THEN CENPROMAR
        WHEN 4 THEN CENPROABR
        WHEN 5 THEN CENPROMAY
        WHEN 6 THEN CENPROJUN
        WHEN 7 THEN CENPROJUL
        WHEN 8 THEN CENPROAGO
        WHEN 9 THEN CENPROSEP
        WHEN 10 THEN CENPROOCT
        WHEN 11 THEN CENPRONOV
        WHEN 13 THEN CENPRODIC
        ELSE
        0
        END) META
        FROM
        GCMCENATEPRO
        WHERE 
        PERIODO = YEAR(@0)
        `,
        [fechaInicio, fechaFin, centro1, centro2]
      );
      const resumen = await this.repository.manager.query(
        `
        SELECT 
          COUNT(*) DOCUMENTOS,
          COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
          COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
  
          (SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      -ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
      ) FACTURADOEVENTO,
          ISNULL(SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0) REGISTROPGP,
          (
          ISNULL(SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          + SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
          -ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          ) PRODUCCION,
          ISNULL(SUM(CASE WHEN CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN NULL ELSE  SFAVALREC END), 0) FACTRECUPERACION,
          ISNULL(SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0) TOTALFACTURASANULADAS,
  
  
          (
          SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END)
          - ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          + ISNULL(SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          ) FACTURADOSUBTOTAL,
  
          ISNULL(SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END), 0) TOTALREFACTURADA,
          (
          SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
          - ISNULL(SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END), 0)
          + ISNULL(SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          - ISNULL(SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END), 0)
          ) FACTURADOPERIODO,
  
  
          ISNULL(SUM(CASE WHEN (SFATIPDOC = 16 OR C.GDECODIGO ='8014') AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0) FACTURADOPGP,
          (
            ISNULL(SUM(CASE WHEN (SFATIPDOC = 16 OR C.GDECODIGO ='8014') AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
            - ISNULL(SUM(CASE WHEN SFATIPDOC = 17 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END), 0)
          ) DEFICITPGP
  
          FROM GCVUSUFACTUR
          INNER JOIN GENDETCON C ON C.OID = GCVUSUFACTUR.GENDETCON
          WHERE
          CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
          AND SFACANANU < 1`,
        [fechaInicio, fechaFin]
      );
      const egresos = await this.repository.manager.query(
        `SELECT 
        COUNT(*) CANTIDAD,
        SUM(C.VALOR) VALOR
        FROM 
        ADNEGRESO E
        RIGHT JOIN(
        SELECT 
        dbo.ADNEGRESO.OID AS ADNEGRESO,
        SUM(dbo.SLNSERPRO.SERVALPRO * dbo.SLNSERPRO.SERCANTID) AS VALOR
        FROM     
        dbo.SLNSERPRO INNER JOIN
        dbo.ADNINGRESO ON dbo.ADNINGRESO.OID = dbo.SLNSERPRO.ADNINGRES1 INNER JOIN
        dbo.ADNEGRESO ON dbo.ADNEGRESO.ADNINGRESO = dbo.ADNINGRESO.OID INNER JOIN
        dbo.SLNORDSER ON dbo.SLNORDSER.OID = dbo.SLNSERPRO.SLNORDSER1 AND dbo.SLNORDSER.SOSESTADO <> 2
        WHERE CONVERT(DATE, dbo.ADNEGRESO.ADEFECSAL, 103) BETWEEN @0 AND @1 
        AND AINESTADO != 1
        GROUP BY 
        dbo.ADNEGRESO.OID
        ) C ON C.ADNEGRESO = E.OID`,
        [fechaInicio, fechaFin]
      );
      return { resumen, meta, egresos };
    }
  }

  async ResumenConsolidado(
    fechaInicio: string,
    fechaFin: string,
    centro1: number,
    centro2: number
  ) {
    const data = new ResumenFacturacion();
    const res = await this.getFacturacionResumen(
      fechaInicio,
      fechaFin,
      centro1,
      centro2
    );
    if (this.conexion === 'AC') {
      const resumen = res.resumen[0];
      const resumenConstant = res.resumenConstant[0];
      const meta = res.meta[0];
      const egreso = res.egresos[0];
      if (centro1 === 1 && centro2 === 2) {
        const CUMPLIMIENTO = Cumplimiento(
          meta,
          resumenConstant.FACTURADOPERIODO
        );
        const DEFICIT = Deficit(meta, resumenConstant.FACTURADOPERIODO);

        data.METAPERIODO = meta.META;
        data.DOCUMENTOS = resumenConstant.DOCUMENTOS;
        data.CANTIDADREFACTURADA = resumenConstant.CANTIDADREFACTURADA;
        data.FACTURASANULADAS = resumenConstant.FACTURASANULADAS;
        data.FACTURADOEVENTO = resumenConstant.FACTURADOEVENTO;
        data.REGISTROPGP = resumenConstant.REGISTROPGP;
        data.PRODUCCION = resumenConstant.PRODUCCION;
        data.FACTRECUPERACION = resumenConstant.FACTRECUPERACION;
        data.TOTALFACTURASANULADAS = resumenConstant.TOTALFACTURASANULADAS;
        data.FACTURADOSUBTOTAL = resumenConstant.FACTURADOSUBTOTAL;
        data.TOTALREFACTURADA = resumenConstant.TOTALREFACTURADA;
        data.FACTURADOPERIODO = resumenConstant.FACTURADOPERIODO;
        data.FACTURADOPGP = resumenConstant.FACTURADOPGP;
        data.DEFICITPGP = resumenConstant.DEFICITPGP;
        data.PROYECCION = resumenConstant.PRODUCCION;
        data.CUMPLIMIENTO = CUMPLIMIENTO;
        data.DEFICIT = DEFICIT;
        data.CANTEGRESO = egreso.CANTIDAD;
        data.VALEGRESO = egreso.VALOR;
      } else {
        const FACTURADOPGP = FacturadoPGP(resumen, resumenConstant);
        const FACTURADOSUBTOTAL = FacturadoSubtotal(resumen, FACTURADOPGP);
        const FACTURADOPERIODO = FacturadoPeriodo(FACTURADOSUBTOTAL, resumen);
        const DEFICIT = Deficit(meta, FACTURADOPERIODO);
        const CUMPLIMIENTO = Cumplimiento(meta, FACTURADOPERIODO);
        const DEFICITPGP = DeficitPGP(FACTURADOPGP, resumen);

        data.METAPERIODO = meta.META;
        data.DOCUMENTOS = resumen.DOCUMENTOS;
        data.CANTIDADREFACTURADA = resumen.CANTIDADREFACTURADA;
        data.FACTURASANULADAS = resumen.FACTURASANULADAS;
        data.FACTURADOEVENTO = resumen.FACTURADOEVENTO;
        data.REGISTROPGP = resumen.REGISTROPGP;
        data.PRODUCCION = resumen.PRODUCCION;
        data.FACTRECUPERACION = resumen.FACTRECUPERACION;
        data.TOTALFACTURASANULADAS = resumen.TOTALFACTURASANULADAS;
        data.FACTURADOSUBTOTAL = FACTURADOSUBTOTAL;
        data.TOTALREFACTURADA = resumen.TOTALREFACTURADA;
        data.FACTURADOPERIODO = FACTURADOPERIODO;
        data.FACTURADOPGP = FACTURADOPGP;
        data.DEFICITPGP = DEFICITPGP;
        data.PROYECCION = resumen.PRODUCCION;
        data.CUMPLIMIENTO = CUMPLIMIENTO;
        data.DEFICIT = DEFICIT;
        data.CANTEGRESO = egreso.CANTIDAD;
        data.VALEGRESO = egreso.VALOR;
      }
      return data;
    } else {
      const resumen = res.resumen[0];
      const meta = res.meta[0];
      const egreso = res.egresos[0];
      //const FACTURADOPGP = FacturadoPGP(resumen, resumenConstant);
      const FACTURADOSUBTOTAL = FacturadoSubtotal(resumen, 0);
      const FACTURADOPERIODO = FacturadoPeriodo(FACTURADOSUBTOTAL, resumen);
      const DEFICIT = Deficit(meta, FACTURADOPERIODO);
      const CUMPLIMIENTO = Cumplimiento(meta, FACTURADOPERIODO);
      //const DEFICITPGP = DeficitPGP(FACTURADOPGP, resumen);

      data.METAPERIODO = meta.META;
      data.DOCUMENTOS = resumen.DOCUMENTOS;
      data.CANTIDADREFACTURADA = resumen.CANTIDADREFACTURADA;
      data.FACTURASANULADAS = resumen.FACTURASANULADAS;
      data.FACTURADOEVENTO = resumen.FACTURADOEVENTO;
      data.REGISTROPGP = resumen.REGISTROPGP;
      data.PRODUCCION = resumen.PRODUCCION;
      data.FACTRECUPERACION = resumen.FACTRECUPERACION;
      data.TOTALFACTURASANULADAS = resumen.TOTALFACTURASANULADAS;
      data.FACTURADOSUBTOTAL = FACTURADOSUBTOTAL;
      data.TOTALREFACTURADA = resumen.TOTALREFACTURADA;
      data.FACTURADOPERIODO = FACTURADOPERIODO;
      data.FACTURADOPGP = resumen.FACTURADOPGP;
      data.DEFICITPGP = resumen.DEFICITPGP;
      data.PROYECCION = resumen.PRODUCCION;
      data.CUMPLIMIENTO = CUMPLIMIENTO;
      data.DEFICIT = DEFICIT;
      data.CANTEGRESO = egreso.CANTIDAD;
      data.VALEGRESO = egreso.VALOR;
      return data;
    }
  }

  async getFacturaciongraficas(
    fechaInicio: string,
    fechaFin: string,
    centro1: number,
    centro2: number
  ) {
    const meta = await this.repository.manager.query(
      `
            SELECT 
      SUM(CASE MONTH(@0)
      WHEN 1 THEN CENPROENE
      WHEN 2 THEN CENPROFEB
      WHEN 3 THEN CENPROMAR
      WHEN 4 THEN CENPROABR
      WHEN 5 THEN CENPROMAY
      WHEN 6 THEN CENPROJUN
      WHEN 7 THEN CENPROJUL
      WHEN 8 THEN CENPROAGO
      WHEN 9 THEN CENPROSEP
      WHEN 10 THEN CENPROOCT
      WHEN 11 THEN CENPRONOV
      WHEN 13 THEN CENPRODIC
      ELSE
      0
      END) META
      FROM
      GCMCENATEPRO
      WHERE 
      PERIODO = YEAR(@0)
      AND ADNCENATE IN(@2, @3)
      `,
      [fechaInicio, fechaFin, centro1, centro2]
    );
    const diario = await this.repository.manager.query(
      `SELECT 
      G.DayNumberOfMonth DIA,
      ISNULL(CONS.PRODUCCION, 0) PRODUCCION
      FROM 
      GCMDIMFECHA G LEFT JOIN(
      SELECT 
      DAY(SFAFECFAC) DIA,
      ISNULL(
      --SUM(CASE WHEN SFATIPDOC = 17  THEN SFATOTFAC ELSE NULL END)+ 
      SUM(CASE WHEN SFATIPDOC IN(0, 1, 17) THEN SFATOTFAC ELSE NULL END) 
      - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END)
      , SUM(CASE WHEN SFATIPDOC IN(0, 1, 17) AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
      ) PRODUCCION
      FROM GCVUSUFACTUR
      WHERE
      CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFACANANU < 1
      AND ADNCENATE IN(@2, @3)
      GROUP BY DAY(SFAFECFAC)
      )CONS ON CONS.DIA = G.DayNumberOfMonth
      WHERE CONVERT(DATE, G.Date, 103) Between @0 AND @1;`,
      [fechaInicio, fechaFin, centro1, centro2]
    );
    const egreso = await this.repository.manager.query(
      `SELECT 
            G.DayNumberOfMonth DIA,
            CONS.FACTURAS FACTURADAS,
          EGRE.FACTURAS PENDIENTES
            FROM GCMDIMFECHA G
            LEFT JOIN 
            (SELECT 
            DAY(SFAFECFAC) DIA,
            COUNT(*) FACTURAS
            FROM GCVUSUFACTUR
            WHERE 
            CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
            AND SFACANANU < 1
            AND ADNCENATE IN(@2, @3)
          AND SFADOCANU = 0
            GROUP BY DAY(SFAFECFAC)
            )CONS ON CONS.DIA = G.DayNumberOfMonth
          LEFT JOIN 
          (
          SELECT 
          DAY(AEGFECEGR)DIA,
           COUNT(*) FACTURAS
          FROM GCVEGRFACTUR
          WHERE CONVERT(DATE, AEGFECEGR, 103) BETWEEN @0 AND @1 
          AND AINESTADO != 1
          AND ADNCENATE IN(@2, @3)
          GROUP BY DAY(AEGFECEGR)
          )EGRE ON G.DayNumberOfMonth = EGRE.DIA
            WHERE CONVERT(DATE, G.Date, 103) BETWEEN @0 AND @1
      `,
      [fechaInicio, fechaFin, centro1, centro2]
    );
    return { meta, diario, egreso };
  }

  async GraficasConsolidado(
    fechaInicio: string,
    fechaFin: string,
    centro1: number,
    centro2: number
  ) {
    const res = await this.getFacturaciongraficas(
      fechaInicio,
      fechaFin,
      centro1,
      centro2
    );
    const facturacionAcumulada: any[] = [];
    let i = 0;
    let produccionAcumulada = 0;
    let proyeccionAcumulada = 0;
    const año = Number(fechaInicio.split('-')[0]);
    const mes = Number(fechaInicio.split('-')[1]);
    const date = new Date(año, mes, 0).getDate();
    const meta = res.meta[0];
    const diario = res.diario;
    const egreso = res.egreso;
    const facturacionDiaria = diario.map((item, index) => {
      return {
        DIA: item.DIA,
        PRODUCCION: item.PRODUCCION,
        PROYECCION: meta.META / date,
      };
    });
    while (i < facturacionDiaria.length) {
      produccionAcumulada += facturacionDiaria[i].PRODUCCION;
      proyeccionAcumulada =
        proyeccionAcumulada + facturacionDiaria[i].PROYECCION;
      facturacionAcumulada.push({
        DIA: facturacionDiaria[i].DIA,
        PRODUCCION: produccionAcumulada,
        PROYECCION: proyeccionAcumulada,
      });
      i++;
    }
    const EgresosFacturados = egreso.map((item, index) => {
      return {
        DIA: item.DIA,
        FACTURAS: item.FACTURADAS,
        PENDIENTES: item.PENDIENTES,
      };
    });
    return { facturacionAcumulada, facturacionDiaria, EgresosFacturados };
  }

  centros = async (fechainicio: string, fechaFin: string) => {
    return await this.repository.manager.query(
      `SELECT 
      ISNULL(ACANOMBRE, 'FACTURA GLOBAL PGP') NOMBRE,
      COUNT(*) DOCUMENTOS,
      COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
      COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
      
      SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END) TOTALFACTURASANULADAS,
      SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END) TOTALREFACTURADA,
      ISNULL(
      SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) 
      BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END),
      SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
      ) FACTURADO,
      SUM(SFATOTFAC) PRODUCCION
      FROM GCVUSUFACTUR
      WHERE
      CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFACANANU < 1
      GROUP BY ACANOMBRE
      ORDER BY ACANOMBRE 
      `,
      [fechainicio, fechaFin]
    );
  };

  documentos = async (fechainicio: string, fechaFin: string) => {
    return await this.repository.manager.query(
      `SELECT 
    Case When SFATIPDOC = 0 Then 'FACTURA PACIENTE'
        When SFATIPDOC = 1 Then 'FACTURA ENTIDAD'
      When SFATIPDOC = 16 Then 'FACTURA GLOBALPFGP'
        Else 'REGISTRO FACTURA GLOBAL PFGP' End As NOMBRE,
    COUNT(*) DOCUMENTOS,
    COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
    COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
    
    SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END) TOTALFACTURASANULADAS,
    SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END) TOTALREFACTURADA,
    ISNULL(
    SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
    - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) 
    BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END),
    SUM(CASE WHEN SFATIPDOC = 16 AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
    ) FACTURADO,
    SUM(SFATOTFAC) PRODUCCION
    FROM GCVUSUFACTUR
    WHERE
    CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
    AND SFACANANU < 1
    GROUP BY SFATIPDOC`,
      [fechainicio, fechaFin]
    );
  };

  servicioEgreso = async (fechainicio: string, fechaFin: string) => {
    return await this.repository.manager.query(
      `SELECT 
      ISNULL(AESNOMBRE, 'INGRESO POR CONSULTA EXTERNA') NOMBRE,
      COUNT(*) DOCUMENTOS,
      COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
      COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
      
      SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END) TOTALFACTURASANULADAS,
      SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END) TOTALREFACTURADA,
      ISNULL(
      SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) 
      BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END),
      SUM(CASE WHEN SFATIPDOC IN(0, 1) AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
      ) FACTURADO,
      SUM(SFATOTFAC) PRODUCCION
      FROM GCVUSUFACTUR
      WHERE
      CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFACANANU < 1
      GROUP BY AESNOMBRE
      `,
      [fechainicio, fechaFin]
    );
  };

  entidades = async (fechainicio: string, fechaFin: string) => {
    return await this.repository.manager.query(
      `SELECT 
      GENTERCER,
      GTRNOMBRE NOMBRE,
      COUNT(*) DOCUMENTOS,
      COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
      COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
      
      SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END) TOTALFACTURASANULADAS,
      SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END) TOTALREFACTURADA,
      ISNULL(
      SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) 
      BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END),
      SUM(CASE WHEN SFATIPDOC IN(0, 1) AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
      ) FACTURADO,
      SUM(SFATOTFAC) PRODUCCION
      FROM GCVUSUFACTUR
      WHERE
      CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFACANANU < 1
      GROUP BY GENTERCER, GTRNOMBRE`,
      [fechainicio, fechaFin]
    );
  };

  contratosPorEntidades = async (
    fechainicio: string,
    fechaFin: string,
    entidad: string
  ) => {
    return await this.repository.manager.query(
      `SELECT 
      GDENOMBRE NOMBRE,
      COUNT(*) DOCUMENTOS,
      COUNT(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
      COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
      
      SUM(CASE WHEN SFADOCANU = 1 AND CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END) TOTALFACTURASANULADAS,
      SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END) TOTALREFACTURADA,
      ISNULL(
      SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN SFATOTFAC ELSE NULL END) 
      - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) 
      BETWEEN @0 AND @1 THEN SFATOTFAC ELSE NULL END),
      SUM(CASE WHEN SFATIPDOC IN(0, 1, 16) AND SFADOCANU = 0 THEN SFATOTFAC ELSE NULL END)
      ) FACTURADO,
      SUM(SFATOTFAC) PRODUCCION
      FROM GCVUSUFACTUR
      WHERE
      CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFACANANU < 1
      AND GENTERCER = @2
      GROUP BY GDENOMBRE`,
      [fechainicio, fechaFin, entidad]
    );
  };

  usuarios = async (fechainicio: string, fechaFin: string) => {
    return await this.repository.manager.query(
      `SELECT 
      SFAGENUSU,
      USUDESCRI,
      COUNT(*) DOCUMENTOS,
      COUNT(CASE WHEN CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN SLNFACTUR ELSE NULL END) FACTURASANULADAS,
      COUNT(CASE WHEN  CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN NULL ELSE SLNFACTUR END) FACTURASREAL,
      COUNT(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SLNFACTUR ELSE NULL END) CANTIDADREFACTURADA,
      
      SUM(CASE WHEN CONVERT(DATE, SFAFECANU, 103) BETWEEN @0 AND @1 THEN G.SFATOTFAC ELSE NULL END) TOTALFACTURASANULADAS,
      SUM(CASE WHEN CONVERT(DATE, SRFFECFAC, 103) < @0 THEN SRFTOTFAC ELSE NULL END) TOTALREFACTURADA,
      ISNULL(
      SUM(CASE WHEN SFATIPDOC IN(0, 1)THEN G.SFATOTFAC ELSE NULL END) 
      - SUM(CASE WHEN SFATIPDOC IN(0, 1) AND CONVERT(DATE, SFAFECANU, 103) 
      BETWEEN @0 AND @1 THEN G.SFATOTFAC ELSE NULL END),
      SUM(CASE WHEN SFATIPDOC IN(0,1, 16) AND SFADOCANU = 0 THEN G.SFATOTFAC ELSE NULL END)
      ) FACTURADO,
      SUM(G.SFATOTFAC) PRODUCCION
      FROM GCVUSUFACTUR G
      WHERE
      CONVERT(DATE, SFAFECFAC, 103) BETWEEN @0 AND @1
      AND SFACANANU < 1
      GROUP BY SFAGENUSU, USUDESCRI`,
      [fechainicio, fechaFin]
    );
  };

  usuariosConsolidado = async (fechainicio: string, fechaFin: string) => {
    const usuarios = await this.usuarios(fechainicio, fechaFin);
    const cantidad = usuarios.length;
    const UsuariosConsolidado = usuarios.map((usuario) => {
      return {
        CODUSUARIO: usuario.SFAGENUSU,
        NOMBRE: usuario.USUDESCRI,
        DOCUMENTOS: usuario.DOCUMENTOS,
        FACTURASANULADAS: usuario.FACTURASANULADAS,
        CANTIDADREFACTURADA: usuario.CANTIDADREFACTURADA,
        TOTALFACTURASANULADAS: usuario.TOTALFACTURASANULADAS,
        TOTALREFACTURADA: usuario.TOTALREFACTURADA,
        FACTURADO: usuario.FACTURADO,
        PRODUCCION: usuario.PRODUCCION,
        PROMEDIODOC: usuario.DOCUMENTOS / cantidad,
        PROMEDIOFACT: usuario.PRODUCCION / cantidad,
        PROMEDIOFACTSUB: usuario.FACTURADO / cantidad,
        PROMEDIOREFACT: usuario.TOTALREFACTURADA / cantidad,
      };
    });
    return UsuariosConsolidado;
  };
}
