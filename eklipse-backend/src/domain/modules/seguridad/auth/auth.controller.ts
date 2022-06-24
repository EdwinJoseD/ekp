import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("seguridad/auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.AuthService.login(dto);
  }
}
