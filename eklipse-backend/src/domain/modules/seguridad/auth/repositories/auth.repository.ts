import { UsuarioEntity } from "src/domain/entities/seguridad/usuario.entity";
import * as cn from "src/application/services/connection.service";

export const AuthRepository = (context: string) =>
  cn
    .getDataSource(context)
    .getRepository(UsuarioEntity)
    .extend({
      /**
       * Obtiene el usuario que está intentando autenticarse atravez de su identificación en el context
       * al cual el usuario quiere acceder.
       * @param identification
       * @returns UsuarioEntity | boolean
       */
      async getUsuario(identification: string) {
        try {
          const result = await cn
            .getDataSource(context)
            .getRepository(UsuarioEntity)
            .createQueryBuilder("usuario")
            .where("usuario.identification = :identification", {
              identification: identification,
            })
            .addSelect("usuario.password")
            .getOne();
          if (result === null) {
            return false;
          } else {
            return result;
          }
        } catch (error) {
          cn.ThrBadReqExc();
        }
      },
    });
