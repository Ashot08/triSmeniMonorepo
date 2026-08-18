import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { JwtRequest } from '@/modules/auth/interfaces/jwt.request.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<JwtRequest>();
    return request.user;
  },
);
