// export class Helpers {
//   Deficit(meta, FACTURADOPERIODO): number {
//     return meta.META - FACTURADOPERIODO;
//   }

//   Cumplimiento(meta, facturadoPeriodo): number {
//     return (facturadoPeriodo / meta.META) * 100;
//   }

//   FacturadoPGP(resumen, resumenConstant): number {
//     const porcentaje = resumen.REGISTROPGP / resumenConstant.REGISTROPGP;
//     return resumenConstant.FACTURADOPGP * porcentaje;
//   }

//   FacturadoSubtotal(resumen, facturadoPgp): number {
//     return resumen.FACTURADOEVENTO + facturadoPgp;
//   }

//   FacturadoPeriodo(FacturadoSubtotal, resumen): number {
//     return FacturadoSubtotal - resumen.TOTALREFACTURADA;
//   }

//   DeficitPGP(facturadoPgp, resumen): number {
//     return facturadoPgp - resumen.REGISTROPGP;
//   }
// }

export const Deficit = (meta, resumenConstant): number => {
  return meta.META - resumenConstant;
};

export const Cumplimiento = (meta, facturadoPeriodo): number => {
  return (facturadoPeriodo / meta.META) * 100;
};

export const FacturadoPGP = (resumen, resumenConstant): number => {
  const porcentaje = resumen.REGISTROPGP / resumenConstant.REGISTROPGP;
  return resumenConstant.FACTURADOPGP * porcentaje;
};

export const FacturadoSubtotal = (resumen, facturadoPgp): number => {
  return resumen.FACTURADOEVENTO + facturadoPgp;
};

export const FacturadoPeriodo = (FacturadoSubtotal, resumen): number => {
  return FacturadoSubtotal - resumen.TOTALREFACTURADA;
};

export const DeficitPGP = (facturadoPgp, resumen): number => {
  return facturadoPgp - resumen.REGISTROPGP;
};
