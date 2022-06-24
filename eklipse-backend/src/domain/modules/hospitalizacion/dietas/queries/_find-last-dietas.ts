import * as cn from "src/application/services/connection.service";

export const DietaCentro = async (context: string) => {
  try {
    const result = await cn
      .getDataSource(context)
      .query(`select top 1 OID from GCMHOSDIECEN order by OID desc;`);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
export const DietaJornada = async (context: string) => {
  try {
    const result = await cn
      .getDataSource(context)
      .query(`select top 1 OID from GCMHOSDIEJOR order by OID desc;`);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
export const DietaGrupo = async (context: string) => {
  try {
    const result = await cn
      .getDataSource(context)
      .query(`select top 1 OID from GCMHOSDIEGRU order by OID desc;`);
    return result;
  } catch (error) {
    cn.ThrBadReqExc();
  }
};
