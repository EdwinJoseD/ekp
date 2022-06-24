import { enc, MD5 } from "crypto-js";

/**
 * Codifica la cadena recibida (generalmente un password) con la encriptación predeterminada.
 * @param password
 * @returns string
 */
export const encode = (password: string) => {
  return enc.Base64.stringify(MD5(enc.Utf16LE.parse(password)));
};
/**
 * Compara la contraseña recibida en el dto con la almacenada en bbdd y retorna true o false
 * dependiendo de si coinciden o no.
 * @param userPassword
 * @param loginPassword
 * @returns boolean
 */
export const comparePassword = (userPassword: string, loginPassword: string) => {
  if (userPassword === encode(loginPassword)) {
    return true;
  } else {
    return false;
  }
};
