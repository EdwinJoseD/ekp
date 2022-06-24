import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, JwtAuthGuard } from '../../auth/guards/';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard, JwtAuthGuard), ApiBearerAuth());
}
