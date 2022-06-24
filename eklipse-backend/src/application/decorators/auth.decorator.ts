import { applyDecorators, UseGuards } from "@nestjs/common";
import JwtAuthGuard from "src/infrastructure/guards/jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
