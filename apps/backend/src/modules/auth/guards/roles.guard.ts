import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtRequest } from '../interfaces/jwt.request.interface';
import { GLOBAL_ROLES_KEY } from '../decorators/roles.decorator';
import { RoleCode } from '@/common/enums/role.enum';

@Injectable()
export class GlobalRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<RoleCode[]>(
        GLOBAL_ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles?.length) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<JwtRequest>();

    const user = request.user;

    const hasRole = requiredRoles.some(role =>
      user.roles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'Insufficient permissions',
      );
    }

    return true;
  }
}
