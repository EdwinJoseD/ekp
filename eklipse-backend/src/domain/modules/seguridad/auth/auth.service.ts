import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AuthRepository } from "./repositories/auth.repository";
import { PayloadI } from "./payload.interface";
import { LoginDto } from "./dtos/login.dto";
import * as CryptoService from "src/application/services/crypto.service";
import * as jwtDecode from "src/application/services/jwt-decode.service";

@Injectable()
export class AuthService {
  context: string;
  successMsg = "Usuario autenticado correctamente";
  AuthFailRes = {
    success: false,
    message: "Usuario no autenticado, nombre y/o contraseña son incorrectos",
    data: [],
  };
  constructor(@Inject(REQUEST) request: Request, private JwtService: JwtService) {
    this.context = jwtDecode.getContext(request);
  }

  async login(dto: LoginDto) {
    const usuario = await AuthRepository(dto.context).getUsuario(dto.identification);
    if (usuario && CryptoService.comparePassword(usuario.password, dto.password)) {
      const payload: PayloadI = {
        identification: usuario.identification,
        roleId: usuario.roleId,
        userId: usuario.ID,
        name: usuario.name,
        context: dto.context,
      };
      const token = this.JwtService.sign(payload);
      payload.token = token;
      return {
        success: true,
        message: this.successMsg,
        data: payload,
      };
    } else {
      return this.AuthFailRes;
    }
  }
}
