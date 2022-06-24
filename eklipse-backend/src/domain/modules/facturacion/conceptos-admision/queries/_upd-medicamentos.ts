import * as cn from "src/application/services/connection.service";
import { UpdateMedicamentosDto } from "../dtos/update-medicamentos.dto";

export const updateMedicamentos = async (
  dto: UpdateMedicamentosDto,
  context: string
): Promise<boolean> => {
  const concFact = dto.conceptoFacturacion;
  const qr = cn.getDataSource(context).createQueryRunner();
  await qr.connect();
  await qr.startTransaction();
  try {
    dto.medicamentos.map(async (id: number) => {
      await cn
        .getDataSource(context)
        .query(`UPDATE SLNPROHOJ SET GENCONFAC = @1 WHERE OID = @0`, [id, concFact]);
    });
    await qr.commitTransaction();
    return true;
  } catch (error) {
    await qr.rollbackTransaction();
    return false;
  } finally {
    await qr.release();
  }
};
