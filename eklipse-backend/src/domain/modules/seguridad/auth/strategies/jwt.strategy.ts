import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PayloadI } from "../payload.interface";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.DB_SECRET,
    });
  }
  /**
   * Verifica si el token recibido pertenece a un usuario existente.
   * @param payload
   * @returns PayloadI
   */
  async validate(payload: PayloadI) {
    const { identification } = payload;
    const user = await AuthRepository(payload.context).findOne({
      where: [{ identification: identification }],
    });
    if (!user) return new UnauthorizedException();
    return payload;
  }
}
