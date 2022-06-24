import { Request } from "express";
import jwt_decode from "jwt-decode";
import { PayloadI } from "src/domain/modules/seguridad/auth/payload.interface";

/**
 * Decodifica el token y retorna el contexto en el cual el usuario se encuentra autenticado.
 * @param req
 * @returns string
 */
export const getContext = (req: Request): string => {
  try {
    return decodeToken(req.headers.authorization.split(" ")[1]).context;
  } catch (error) {
    return null;
  }
};
/**
 * Decodifica el token y retorna el id del usuario autenticado.
 * @param req
 * @returns string
 */
export const getUserId = (req: Request): number => {
  try {
    return decodeToken(req.headers.authorization.split(" ")[1]).userId;
  } catch (error) {
    return null;
  }
};
const decodeToken = (token: string): PayloadI => {
  return jwt_decode(token);
};
