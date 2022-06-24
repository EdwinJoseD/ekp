import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ResponseI } from "../interfaces/response.interface";
import * as jwtDecode from "./jwt-decode.service";

@Injectable()
export class BaseService {
  /** Retorna el contexto en el cual el usuario se encuentra autenticado el cual ha sido
   * extraido del token de autenticación interceptado en el constructor de la clase BaseService. */
  protected context: string;
  protected authUserId: number;
  private badSuccessMsg: string = "La consulta no devolvió el resultado esperado";
  private SuccessMsg: string = "Información consultada correctamente";

  constructor(@Inject(REQUEST) request: Request) {
    this.context = jwtDecode.getContext(request);
    this.authUserId = jwtDecode.getUserId(request);
  }
  /**
   * Retorna un response con success false y el mensaje recibido por parametro.
   *
   * Mensaje por defecto: "La consulta no devolvió el resultado esperado".
   *
   * @param message
   * @returns ResponseI
   */
  protected badSuccessRes(message: string = this.badSuccessMsg): ResponseI {
    return {
      success: false,
      message: message,
      data: [],
    };
  }
  /**
   * Retorna un response con success true, el mensaje y la data recibidos por parametro.
   *
   * Mensaje por defecto: "Información consultada correctamente".
   *
   * @param data
   * @param message
   * @returns ResponseI
   */
  protected successRes(data: any, message: string = this.SuccessMsg): ResponseI {
    return {
      success: true,
      message: message,
      data: data,
    };
  }
}
