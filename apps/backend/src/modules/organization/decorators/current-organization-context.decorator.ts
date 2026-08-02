import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { JwtRequest } from '@/modules/auth/interfaces/jwt.request.interface';

export const CurrentOrganizationContext = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request =
      ctx.switchToHttp().getRequest<JwtRequest>();

    return request.organizationContext;
  },
);
